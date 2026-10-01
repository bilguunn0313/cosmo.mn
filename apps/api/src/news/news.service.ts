import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  AdminNewsQuery,
  CreateNewsInput,
  Locale,
  PublicNewsQuery,
  UpdateNewsInput,
} from '@cosmo/shared';
import { pickTranslation } from '../common/pick-translation';
import { sanitizeRichText } from '../common/sanitize-rich-text';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const newsInclude = {
  coverImage: true,
  translations: true,
} satisfies Prisma.NewsInclude;

type NewsTranslations = CreateNewsInput['translations'];

function sanitizeTranslations(translations: NewsTranslations) {
  return translations.map((translation) => ({
    ...translation,
    content: sanitizeRichText(translation.content),
  }));
}

function resolvePublishedAt(
  isPublished: boolean | undefined,
  publishedAt: string | null | undefined,
  currentPublishedAt: Date | null,
): Date | null | undefined {
  if (publishedAt !== undefined) {
    return publishedAt === null ? null : new Date(publishedAt);
  }

  if (isPublished && !currentPublishedAt) {
    return new Date();
  }

  return undefined;
}

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: AdminNewsQuery) {
    const where: Prisma.NewsWhereInput = { type: query.type };

    const [items, total] = await Promise.all([
      this.prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: newsInclude,
      }),
      this.prisma.news.count({ where }),
    ]);

    return { items, total, page: query.page, limit: query.limit };
  }

  async findOne(id: number) {
    const news = await this.prisma.news.findUnique({
      where: { id },
      include: newsInclude,
    });

    if (!news) {
      throw new NotFoundException('Мэдээ олдсонгүй');
    }

    return news;
  }

  create(input: CreateNewsInput) {
    return this.prisma.news.create({
      data: {
        slug: input.slug,
        type: input.type,
        coverImageId: input.coverImageId,
        videoUrl: input.videoUrl,
        isPublished: input.isPublished,
        publishedAt: resolvePublishedAt(input.isPublished, input.publishedAt, null),
        translations: { create: sanitizeTranslations(input.translations) },
      },
      include: newsInclude,
    });
  }

  async update(id: number, input: UpdateNewsInput) {
    const existing = await this.findOne(id);

    const { translations, publishedAt, ...fields } = input;
    const data: Prisma.NewsUncheckedUpdateInput = {
      ...fields,
      publishedAt: resolvePublishedAt(
        input.isPublished,
        publishedAt,
        existing.publishedAt,
      ),
    };

    if (translations) {
      data.translations = {
        deleteMany: {},
        create: sanitizeTranslations(translations),
      };
    }

    return this.prisma.news.update({
      where: { id },
      data,
      include: newsInclude,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.news.delete({ where: { id } });
  }

  async findPublished(query: PublicNewsQuery) {
    const where: Prisma.NewsWhereInput = {
      type: query.type,
      isPublished: true,
      publishedAt: { lte: new Date() },
    };

    const [items, total] = await Promise.all([
      this.prisma.news.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: newsInclude,
      }),
      this.prisma.news.count({ where }),
    ]);

    return {
      items: items.map((news) => {
        const translation = pickTranslation(news.translations, query.locale);

        return {
          slug: news.slug,
          type: news.type,
          title: translation?.title ?? '',
          summary: translation?.summary ?? null,
          coverUrl: news.coverImage?.url ?? null,
          videoUrl: news.videoUrl,
          publishedAt: news.publishedAt,
        };
      }),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async findPublishedBySlug(slug: string, locale: Locale) {
    const news = await this.prisma.news.findUnique({
      where: { slug },
      include: newsInclude,
    });

    const isVisible =
      news?.isPublished && news.publishedAt && news.publishedAt <= new Date();

    if (!news || !isVisible) {
      throw new NotFoundException('Мэдээ олдсонгүй');
    }

    const translation = pickTranslation(news.translations, locale);

    return {
      slug: news.slug,
      type: news.type,
      title: translation?.title ?? '',
      summary: translation?.summary ?? null,
      content: translation?.content ?? '',
      coverUrl: news.coverImage?.url ?? null,
      videoUrl: news.videoUrl,
      publishedAt: news.publishedAt,
    };
  }
}
