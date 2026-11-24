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
  | 'milestone'
  | 'retailPartner'
  | 'news'
  | 'siteSetting';

export interface MediaUsage {
  type: MediaUsageType;
  id: number;
  title: string;
}

interface SiteSettingImageIds {
  mapImageId: number | null;
  aboutBannerImageId: number | null;
  careersBannerImageId: number | null;
  mediaBannerImageId: number | null;
  brandsBannerImageId: number | null;
  contactBannerImageId: number | null;
  hrGovernanceImageId: number | null;
  homeAboutImageId: number | null;
  ceoImageId: number | null;
  purposeImageId: number | null;
}

function siteSettingUsageTitle(setting: SiteSettingImageIds, id: number) {
  if (setting.mapImageId === id) {
    return 'Байршлын зураг';
  }

  if (setting.homeAboutImageId === id) {
    return 'Нүүр хуудасны «Бидний тухай» зураг';
  }

  if (setting.ceoImageId === id) {
    return 'Гүйцэтгэх захирлын зураг';
  }

  if (setting.purposeImageId === id) {
    return 'Эрхэм зорилго, алсын харааны зураг';
  }

  const bannerIds = [
    setting.aboutBannerImageId,
    setting.careersBannerImageId,
    setting.mediaBannerImageId,
    setting.brandsBannerImageId,
    setting.contactBannerImageId,
    setting.hrGovernanceImageId,
  ];

  return bannerIds.includes(id) ? 'Хуудасны баннер' : 'Үнэт зүйлсийн зураг';
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
      milestones,
      retailPartners,
      news,
      siteSettings,
    ] = await Promise.all([
      this.prisma.slide.findMany({
        where: { OR: [{ mediaId: id }, { posterId: id }] },
      }),
      this.prisma.brand.findMany({
        where: {
          OR: [{ logoId: id }, { coverId: id }, { showcaseImageId: id }],
        },
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
      this.prisma.milestone.findMany({
        where: { imageId: id },
        include: { translations: true },
      }),
      this.prisma.retailPartner.findMany({ where: { logoId: id } }),
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
      this.prisma.siteSetting.findMany({
        where: {
          OR: [
            { mapImageId: id },
            { aboutBannerImageId: id },
            { careersBannerImageId: id },
            { mediaBannerImageId: id },
            { brandsBannerImageId: id },
            { contactBannerImageId: id },
            { hrGovernanceImageId: id },
            { valuePeopleImageId: id },
            { valueSatisfactionImageId: id },
            { valueQualityImageId: id },
            { valueResponsibilityImageId: id },
            { homeAboutImageId: id },
            { ceoImageId: id },
            { purposeImageId: id },
          ],
        },
      }),
    ]);

    return [
      ...slides.map((slide) => ({
        type: 'slide' as const,
        id: slide.id,
        title: `Слайд ${slide.order + 1}`,
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
      ...milestones.map((milestone) => ({
        type: 'milestone' as const,
        id: milestone.id,
        title: [
          milestone.year,
          pickTranslation(milestone.translations, DEFAULT_LOCALE)?.title,
        ]
          .filter(Boolean)
          .join(' '),
      })),
      ...retailPartners.map((partner) => ({
        type: 'retailPartner' as const,
        id: partner.id,
        title: partner.name,
      })),
      ...news.map((item) => ({
        type: 'news' as const,
        id: item.id,
        title: pickTranslation(item.translations, DEFAULT_LOCALE)?.title ?? '',
      })),
      ...siteSettings.map((setting) => ({
        type: 'siteSetting' as const,
        id: setting.id,
        title: siteSettingUsageTitle(setting, id),
      })),
    ];
  }
}
