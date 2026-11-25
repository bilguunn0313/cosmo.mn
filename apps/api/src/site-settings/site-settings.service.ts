import { Injectable } from '@nestjs/common';
import type { Locale, UpdateSiteSettingInput } from '@cosmo/shared';
import { framedImageUrl } from '../common/framed-image-url';
import { pickTranslation } from '../common/pick-translation';
import { Prisma } from '../generated/prisma/client';
import { MediaService } from '../media/media.service';
import { PrismaService } from '../prisma/prisma.service';

const SITE_SETTING_ID = 1;

const SITE_SETTING_IMAGE_FIELDS = [
  'mapImageId',
  'aboutBannerImageId',
  'careersBannerImageId',
  'mediaBannerImageId',
  'brandsBannerImageId',
  'contactBannerImageId',
  'hrGovernanceImageId',
  'hrJobsImageId',
  'ceoImageId',
  'valuePeopleImageId',
  'valueSatisfactionImageId',
  'valueQualityImageId',
  'valueResponsibilityImageId',
  'homeAboutImageId',
] as const;

const siteSettingInclude = {
  mapImage: true,
  aboutBannerImage: true,
  careersBannerImage: true,
  mediaBannerImage: true,
  brandsBannerImage: true,
  contactBannerImage: true,
  hrGovernanceImage: true,
  hrJobsImage: true,
  ceoImage: true,
  valuePeopleImage: true,
  valueSatisfactionImage: true,
  valueQualityImage: true,
  valueResponsibilityImage: true,
  homeAboutImage: true,
  translations: true,
} satisfies Prisma.SiteSettingInclude;

@Injectable()
export class SiteSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  get() {
    return this.prisma.siteSetting.upsert({
      where: { id: SITE_SETTING_ID },
      update: {},
      create: { id: SITE_SETTING_ID },
      include: siteSettingInclude,
    });
  }

  async update(input: UpdateSiteSettingInput) {
    const setting = await this.get();

    const { translations, ...fields } = input;
    const data: Prisma.SiteSettingUncheckedUpdateInput = { ...fields };

    if (translations) {
      data.translations = {
        deleteMany: {},
        create: translations,
      };
    }

    const updated = await this.prisma.siteSetting.update({
      where: { id: SITE_SETTING_ID },
      data,
      include: siteSettingInclude,
    });

    await this.mediaService.removeUnused(
      SITE_SETTING_IMAGE_FIELDS.map((field) => setting[field]),
    );
    return updated;
  }

  async getPublic(locale: Locale) {
    const setting = await this.get();
    const translation = pickTranslation(setting.translations, locale);

    return {
      phone: setting.phone,
      email: setting.email,
      facebookUrl: setting.facebookUrl,
      instagramUrl: setting.instagramUrl,
      youtubeUrl: setting.youtubeUrl,
      linkedinUrl: setting.linkedinUrl,
      mapUrl: setting.mapUrl,
      mapEmbedUrl: setting.mapEmbedUrl,
      mapImageUrl: setting.mapImage?.url ?? null,
      foundedYear: setting.foundedYear,
      employeeCount: setting.employeeCount,
      salesPointCount: setting.salesPointCount,
      productCount: setting.productCount,
      pageBanners: {
        about: framedImageUrl(setting.aboutBannerImage),
        careers: framedImageUrl(setting.careersBannerImage),
        media: framedImageUrl(setting.mediaBannerImage),
        brands: framedImageUrl(setting.brandsBannerImage),
        contact: framedImageUrl(setting.contactBannerImage),
        hrGovernance: framedImageUrl(setting.hrGovernanceImage),
        hrJobs: framedImageUrl(setting.hrJobsImage),
      },
      valueImages: {
        people: framedImageUrl(setting.valuePeopleImage),
        satisfaction: framedImageUrl(setting.valueSatisfactionImage),
        quality: framedImageUrl(setting.valueQualityImage),
        responsibility: framedImageUrl(setting.valueResponsibilityImage),
      },
      homeAboutImageUrl: framedImageUrl(setting.homeAboutImage),
      ceoImageUrl: framedImageUrl(setting.ceoImage),
      address: translation?.address ?? null,
      workingHours: translation?.workingHours ?? null,
    };
  }
}
