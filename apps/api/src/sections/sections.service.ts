import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateSectionInput,
  PublicSectionsQuery,
  SectionPage,
  UpdateSectionInput,
} from '@cosmo/shared';
import { pickTranslation } from '../common/pick-translation';
import { sanitizeRichText } from '../common/sanitize-rich-text';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const sectionInclude = {
  image: true,
  translations: true,
} satisfies Prisma.SectionInclude;

type SectionTranslations = CreateSectionInput['translations'];

function sanitizeTranslations(translations: SectionTranslations) {
  return translations.map((translation) => ({
    ...translation,
    body: sanitizeRichText(translation.body),
  }));
}

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(page: SectionPage) {
    return this.prisma.section.findMany({
      where: { page },
      orderBy: { order: 'asc' },
      include: sectionInclude,
    });
  }

  async findOne(id: number) {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: sectionInclude,
    });

    if (!section) {
      throw new NotFoundException('Хэсэг олдсонгүй');
    }

    return section;
  }

  async create(input: CreateSectionInput) {
    const lastSection = await this.prisma.section.findFirst({
      where: { page: input.page },
      orderBy: { order: 'desc' },
    });
    const nextOrder = lastSection ? lastSection.order + 1 : 0;

    return this.prisma.section.create({
      data: {
        page: input.page,
        imageId: input.imageId,
        linkUrl: input.linkUrl,
        isVisible: input.isVisible,
        order: nextOrder,
        translations: { create: sanitizeTranslations(input.translations) },
      },
      include: sectionInclude,
    });
  }

  async update(id: number, input: UpdateSectionInput) {
    await this.findOne(id);

    const { translations, ...fields } = input;
    const data: Prisma.SectionUncheckedUpdateInput = { ...fields };

    if (translations) {
      data.translations = {
        deleteMany: {},
        create: sanitizeTranslations(translations),
      };
    }

    return this.prisma.section.update({
      where: { id },
      data,
      include: sectionInclude,
    });
  }

  async reorder(ids: number[]) {
    await this.prisma.$transaction(async (tx) => {
      for (const [index, id] of ids.entries()) {
        await tx.section.update({ where: { id }, data: { order: index } });
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.section.delete({ where: { id } });
  }

  async findVisible(query: PublicSectionsQuery) {
    const sections = await this.prisma.section.findMany({
      where: { page: query.page, isVisible: true },
      orderBy: { order: 'asc' },
      include: sectionInclude,
    });

    return sections.map((section) => {
      const translation = pickTranslation(section.translations, query.locale);

      return {
        id: section.id,
        title: translation?.title ?? '',
        body: translation?.body ?? '',
        imageUrl: section.image?.url ?? null,
        linkUrl: section.linkUrl,
      };
    });
  }
}
