import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { endOfCompanyDay, startOfCompanyDay } from '@cosmo/shared';
import type {
  CreateJobPostingInput,
  Locale,
  UpdateJobPostingInput,
} from '@cosmo/shared';
import { pickTranslation } from '../common/pick-translation';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const jobInclude = {
  translations: true,
} satisfies Prisma.JobPostingInclude;

type JobWithTranslations = Prisma.JobPostingGetPayload<{
  include: typeof jobInclude;
}>;

const LIST_MARKER = /^[\s\-–•*·]+/;

function toListItems(text: string | null | undefined) {
  return (text ?? '')
    .split('\n')
    .map((line) => line.replace(LIST_MARKER, '').trim())
    .filter((line) => line !== '');
}

export function openJobsWhere(now: Date): Prisma.JobPostingWhereInput {
  return {
    isPublished: true,
    openedAt: { lte: now },
    OR: [{ closesAt: null }, { closesAt: { gte: now } }],
  };
}

function toClosesAt(closesOn: string | null) {
  return closesOn === null ? null : endOfCompanyDay(closesOn);
}

function assertClosesAfterOpening(openedAt: Date, closesAt: Date | null) {
  if (closesAt && closesAt < openedAt) {
    throw new BadRequestException(
      'Хаах огноо нь нээсэн огнооноос өмнө байж болохгүй',
    );
  }
}

function toPublicJob(job: JobWithTranslations, locale: Locale) {
  const translation = pickTranslation(job.translations, locale);

  return {
    slug: job.slug,
    title: translation?.title ?? '',
    department: job.department,
    employmentType: job.employmentType,
    stage: job.stage,
    location: translation?.location ?? null,
    openedAt: job.openedAt,
    closesAt: job.closesAt,
  };
}

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.jobPosting.findMany({
      orderBy: { openedAt: 'desc' },
      include: jobInclude,
    });
  }

  async findOne(id: number) {
    const job = await this.prisma.jobPosting.findUnique({
      where: { id },
      include: jobInclude,
    });

    if (!job) {
      throw new NotFoundException('Ажлын байр олдсонгүй');
    }

    return job;
  }

  create(input: CreateJobPostingInput) {
    const openedAt = startOfCompanyDay(input.openedOn);
    const closesAt = toClosesAt(input.closesOn);
    assertClosesAfterOpening(openedAt, closesAt);

    return this.prisma.jobPosting.create({
      data: {
        slug: input.slug,
        department: input.department,
        employmentType: input.employmentType,
        stage: input.stage,
        openedAt,
        closesAt,
        isPublished: input.isPublished,
        translations: { create: input.translations },
      },
      include: jobInclude,
    });
  }

  async update(id: number, input: UpdateJobPostingInput) {
    const existing = await this.findOne(id);
    const { translations, openedOn, closesOn, ...fields } = input;

    const openedAt = openedOn ? startOfCompanyDay(openedOn) : existing.openedAt;
    const closesAt =
      closesOn === undefined ? existing.closesAt : toClosesAt(closesOn);
    assertClosesAfterOpening(openedAt, closesAt);

    const data: Prisma.JobPostingUncheckedUpdateInput = {
      ...fields,
      openedAt,
      closesAt,
    };

    if (translations) {
      data.translations = { deleteMany: {}, create: translations };
    }

    return this.prisma.jobPosting.update({
      where: { id },
      data,
      include: jobInclude,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.jobPosting.delete({ where: { id } });
  }

  async findOpen(locale: Locale) {
    const jobs = await this.prisma.jobPosting.findMany({
      where: openJobsWhere(new Date()),
      orderBy: { openedAt: 'desc' },
      include: jobInclude,
    });

    return jobs.map((job) => toPublicJob(job, locale));
  }

  async findOpenBySlug(slug: string, locale: Locale) {
    const job = await this.prisma.jobPosting.findFirst({
      where: { slug, ...openJobsWhere(new Date()) },
      include: jobInclude,
    });

    if (!job) {
      throw new NotFoundException('Ажлын байр олдсонгүй');
    }

    const translation = pickTranslation(job.translations, locale);

    return {
      ...toPublicJob(job, locale),
      salary: translation?.salary ?? null,
      summary: translation?.summary ?? null,
      duties: toListItems(translation?.duties),
      requirements: toListItems(translation?.requirements),
      offers: toListItems(translation?.offers),
    };
  }
}
