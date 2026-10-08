import { Injectable } from '@nestjs/common';
import { DEFAULT_LOCALE } from '@cosmo/shared';
import { pickTranslation } from '../common/pick-translation';
import { PrismaService } from '../prisma/prisma.service';

export type MediaUsageType =
  | 'slide'
  | 'brand'
  | 'brandSection'
  | 'product'
  | 'section'
  | 'news'
  | 'siteSetting';

export interface MediaUsage {
  type: MediaUsageType;
  id: number;
  title: string;
}

@Injectable()
export class MediaUsageService {
  constructor(private readonly prisma: PrismaService) {}

  async findUsages(media: { id: number; url: string }): Promise<MediaUsage[]> {
    const { id, url } = media;

    const [
      slides,
      brands,
      brandSections,
      products,
      sections,
      news,
      siteSettings,
    ] = await Promise.all([
      this.prisma.slide.findMany({
        where: { OR: [{ mediaId: id }, { posterId: id }] },
        include: { translations: true },
      }),
      this.prisma.brand.findMany({
        where: { OR: [{ logoId: id }, { coverId: id }] },
        include: { translations: true },
      }),
      this.prisma.brandSection.findMany({
        where: {
          OR: [
            { imageId: id },
            { translations: { some: { body: { contains: url } } } },
          ],
        },
        include: { translations: true },
      }),
      this.prisma.product.findMany({
        where: { imageId: id },
        include: { translations: true },
      }),
      this.prisma.section.findMany({
        where: {
          OR: [
            { imageId: id },
            { translations: { some: { body: { contains: url } } } },
          ],
        },
        include: { translations: true },
      }),
      this.prisma.news.findMany({
        where: {
          OR: [
            { coverImageId: id },
            { videoId: id },
            { translations: { some: { content: { contains: url } } } },
          ],
        },
        include: { translations: true },
      }),
      this.prisma.siteSetting.findMany({ where: { mapImageId: id } }),
    ]);

    return [
      ...slides.map((slide) => ({
        type: 'slide' as const,
        id: slide.id,
        title: pickTranslation(slide.translations, DEFAULT_LOCALE)?.title ?? '',
      })),
      ...brands.map((brand) => ({
        type: 'brand' as const,
        id: brand.id,
        title: pickTranslation(brand.translations, DEFAULT_LOCALE)?.name ?? '',
      })),
      ...brandSections.map((section) => ({
        type: 'brandSection' as const,
        id: section.id,
        title:
          pickTranslation(section.translations, DEFAULT_LOCALE)?.title ?? '',
      })),
      ...products.map((product) => ({
        type: 'product' as const,
        id: product.id,
        title:
          pickTranslation(product.translations, DEFAULT_LOCALE)?.name ?? '',
      })),
      ...sections.map((section) => ({
        type: 'section' as const,
        id: section.id,
        title:
          pickTranslation(section.translations, DEFAULT_LOCALE)?.title ?? '',
      })),
      ...news.map((item) => ({
        type: 'news' as const,
        id: item.id,
        title: pickTranslation(item.translations, DEFAULT_LOCALE)?.title ?? '',
      })),
      ...siteSettings.map((setting) => ({
        type: 'siteSetting' as const,
        id: setting.id,
        title: 'Байршлын зураг',
      })),
    ];
  }
}
