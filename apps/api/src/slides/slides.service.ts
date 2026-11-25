import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateSlideInput, UpdateSlideInput } from '@cosmo/shared';
import { framedImageUrl } from '../common/framed-image-url';
import { Prisma } from '../generated/prisma/client';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';

const slideInclude = {
  media: true,
  poster: true,
} satisfies Prisma.SlideInclude;

@Injectable()
export class SlidesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  findAll() {
    return this.prisma.slide.findMany({
      orderBy: { order: 'asc' },
      include: slideInclude,
    });
  }

  async findActive() {
    const slides = await this.prisma.slide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: slideInclude,
    });

    return slides.map((slide) => ({
      id: slide.id,
      mediaType: slide.media.type,
      mediaUrl: framedImageUrl(slide.media),
      posterUrl: slide.poster?.url ?? null,
    }));
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
        isActive: input.isActive,
        order: nextOrder,
      },
      include: slideInclude,
    });
  }

  async update(id: number, input: UpdateSlideInput) {
    const slide = await this.findOne(id);

    const updated = await this.prisma.slide.update({
      where: { id },
      data: input,
      include: slideInclude,
    });

    await this.mediaService.removeUnused([slide.mediaId, slide.posterId]);
    return updated;
  }

  async reorder(ids: number[]) {
    await this.prisma.$transaction(async (tx) => {
      for (const [index, id] of ids.entries()) {
        await tx.slide.update({ where: { id }, data: { order: index } });
      }
    });
  }

  async remove(id: number) {
    const slide = await this.findOne(id);
    await this.prisma.slide.delete({ where: { id } });
    await this.mediaService.removeUnused([slide.mediaId, slide.posterId]);
  }
}
