import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateBrandSectionInput,
  UpdateBrandSectionInput,
} from '@cosmo/shared';
import { sanitizeRichText } from '../common/sanitize-rich-text';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const sectionInclude = {
  image: true,
  translations: true,
} satisfies Prisma.BrandSectionInclude;

type SectionTranslations = NonNullable<CreateBrandSectionInput['translations']>;

function sanitizeTranslations(translations: SectionTranslations) {
  return translations.map((translation) => ({
    ...translation,
    body: sanitizeRichText(translation.body),
  }));
}

@Injectable()
export class BrandSectionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(brandId: number) {
    return this.prisma.brandSection.findMany({
      where: { brandId },
      orderBy: { order: 'asc' },
      include: sectionInclude,
    });
  }

  async findOne(brandId: number, id: number) {
    const section = await this.prisma.brandSection.findFirst({
      where: { id, brandId },
      include: sectionInclude,
    });

    if (!section) {
      throw new NotFoundException('Хэсэг олдсонгүй');
    }

    return section;
  }

  async create(brandId: number, input: CreateBrandSectionInput) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException('Брэнд олдсонгүй');
    }

    const lastSection = await this.prisma.brandSection.findFirst({
      where: { brandId },
      orderBy: { order: 'desc' },
    });
    const nextOrder = lastSection ? lastSection.order + 1 : 0;

    return this.prisma.brandSection.create({
      data: {
        brandId,
        imageId: input.imageId,
        isVisible: input.isVisible,
        order: nextOrder,
        translations: { create: sanitizeTranslations(input.translations) },
      },
      include: sectionInclude,
    });
  }

  async update(brandId: number, id: number, input: UpdateBrandSectionInput) {
    await this.findOne(brandId, id);

    const { translations, ...fields } = input;
    const data: Prisma.BrandSectionUncheckedUpdateInput = { ...fields };

    if (translations) {
      data.translations = {
        deleteMany: {},
        create: sanitizeTranslations(translations),
      };
    }

    return this.prisma.brandSection.update({
      where: { id },
      data,
      include: sectionInclude,
    });
  }

  async reorder(brandId: number, ids: number[]) {
    await this.prisma.$transaction(async (tx) => {
      for (const [index, id] of ids.entries()) {
        await tx.brandSection.update({
          where: { id, brandId },
          data: { order: index },
        });
      }
    });
  }

  async remove(brandId: number, id: number) {
    await this.findOne(brandId, id);
    await this.prisma.brandSection.delete({ where: { id } });
  }
}
