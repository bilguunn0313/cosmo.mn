import { Injectable, NotFoundException } from '@nestjs/common';
import { DEFAULT_LOCALE } from '@cosmo/shared';
import type {
  CreateMilestoneInput,
  Locale,
  UpdateMilestoneInput,
} from '@cosmo/shared';
import { pickTranslation } from '../common/pick-translation';
import { Prisma } from '../generated/prisma/client';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';

const milestoneInclude = {
  image: true,
  translations: true,
} satisfies Prisma.MilestoneInclude;

const chronologicalOrder = [
  { year: 'asc' },
  { id: 'asc' },
] satisfies Prisma.MilestoneOrderByWithRelationInput[];

@Injectable()
export class MilestonesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  findAll() {
    return this.prisma.milestone.findMany({
      orderBy: chronologicalOrder,
      include: milestoneInclude,
    });
  }

  async findOne(id: number) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id },
      include: milestoneInclude,
    });

    if (!milestone) {
      throw new NotFoundException('Үйл явдал олдсонгүй');
    }

    return milestone;
  }

  create(input: CreateMilestoneInput) {
    return this.prisma.milestone.create({
      data: {
        year: input.year,
        imageId: input.imageId,
        isVisible: input.isVisible,
        translations: { create: input.translations },
      },
      include: milestoneInclude,
    });
  }

  async update(id: number, input: UpdateMilestoneInput) {
    const milestone = await this.findOne(id);

    const { translations, ...fields } = input;
    const data: Prisma.MilestoneUncheckedUpdateInput = { ...fields };

    if (translations) {
      data.translations = { deleteMany: {}, create: translations };
    }

    const updated = await this.prisma.milestone.update({
      where: { id },
      data,
      include: milestoneInclude,
    });

    await this.mediaService.removeUnused([milestone.imageId]);
    return updated;
  }

  async remove(id: number) {
    const milestone = await this.findOne(id);
    await this.prisma.milestone.delete({ where: { id } });
    await this.mediaService.removeUnused([milestone.imageId]);
  }

  async findVisible(locale: Locale) {
    const milestones = await this.prisma.milestone.findMany({
      where: { isVisible: true },
      orderBy: chronologicalOrder,
      include: milestoneInclude,
    });

    return milestones.map((milestone) => {
      const translation = pickTranslation(milestone.translations, locale);
      const fallback = pickTranslation(milestone.translations, DEFAULT_LOCALE);

      return {
        id: milestone.id,
        year: milestone.year,
        title: translation?.title || fallback?.title || '',
        description: translation?.description ?? null,
        imageUrl: milestone.image?.url ?? null,
      };
    });
  }
}
