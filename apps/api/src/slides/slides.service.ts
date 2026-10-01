import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateSlideInput, Locale, UpdateSlideInput } from '@cosmo/shared';
import { pickTranslation } from '../common/pick-translation';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const slideInclude = {
  media: true,
  poster: true,
  translations: true,
} satisfies Prisma.SlideInclude;

@Injectable()
export class SlidesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.slide.findMany({
      orderBy: { order: 'asc' },
      include: slideInclude,
    });
  }

  async findActive(locale: Locale) {
    const slides = await this.prisma.slide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: slideInclude,
    });

    return slides.map((slide) => {
      const translation = pickTranslation(slide.translations, locale);

      return {
        id: slide.id,
        mediaType: slide.media.type,
        mediaUrl: slide.media.url,
        posterUrl: slide.poster?.url ?? null,
        linkUrl: slide.linkUrl,
        title: translation?.title ?? '',
        subtitle: translation?.subtitle ?? null,
        buttonText: translation?.buttonText ?? null,
      };
    });
  }

  async findOne(id: number) {
    const slide = await this.prisma.slide.findUnique({
      where: { id },
      include: slideInclude,
    });

    if (!slide) {
      throw new NotFoundException('Слайд олдсонгүй');
    }

    return slide;
  }

  async create(input: CreateSlideInput) {
    const lastSlide = await this.prisma.slide.findFirst({
      orderBy: { order: 'desc' },
    });
    const nextOrder = lastSlide ? lastSlide.order + 1 : 0;

    return this.prisma.slide.create({
      data: {
        mediaId: input.mediaId,
        posterId: input.posterId,
        linkUrl: input.linkUrl,
        isActive: input.isActive,
        order: nextOrder,
        translations: { create: input.translations },
      },
      include: slideInclude,
    });
  }

  async update(id: number, input: UpdateSlideInput) {
    await this.findOne(id);

    const { translations, ...fields } = input;
    const data: Prisma.SlideUncheckedUpdateInput = { ...fields };

    if (translations) {
      data.translations = {
        deleteMany: {},
        create: translations,
      };
    }

    return this.prisma.slide.update({
      where: { id },
      data,
      include: slideInclude,
    });
  }

  async reorder(ids: number[]) {
    await this.prisma.$transaction(async (tx) => {
      for (const [index, id] of ids.entries()) {
        await tx.slide.update({ where: { id }, data: { order: index } });
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.slide.delete({ where: { id } });
  }
}
