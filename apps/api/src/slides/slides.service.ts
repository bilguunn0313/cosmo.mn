import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateSlideInput, UpdateSlideInput } from '@cosmo/shared';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const slideInclude = {
  media: true,
  poster: true,
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

  async findActive() {
    const slides = await this.prisma.slide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: slideInclude,
    });

    return slides.map((slide) => ({
      id: slide.id,
      mediaType: slide.media.type,
      mediaUrl: slide.media.url,
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
    await this.findOne(id);

    return this.prisma.slide.update({
      where: { id },
      data: input,
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
