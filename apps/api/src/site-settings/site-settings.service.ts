import { Injectable } from '@nestjs/common';
import type { Locale, UpdateSiteSettingInput } from '@cosmo/shared';
import { pickTranslation } from '../common/pick-translation';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const SITE_SETTING_ID = 1;

const siteSettingInclude = {
  mapImage: true,
  foodImage: true,
  beautyImage: true,
  householdImage: true,
  translations: true,
} satisfies Prisma.SiteSettingInclude;

@Injectable()
export class SiteSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  get() {
    return this.prisma.siteSetting.upsert({
      where: { id: SITE_SETTING_ID },
      update: {},
      create: { id: SITE_SETTING_ID },
      include: siteSettingInclude,
    });
  }

  async update(input: UpdateSiteSettingInput) {
    await this.get();

    const { translations, ...fields } = input;
    const data: Prisma.SiteSettingUncheckedUpdateInput = { ...fields };

    if (translations) {
      data.translations = {
        deleteMany: {},
        create: translations,
      };
    }

    return this.prisma.siteSetting.update({
      where: { id: SITE_SETTING_ID },
      data,
      include: siteSettingInclude,
    });
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
      mapImageUrl: setting.mapImage?.url ?? null,
      foundedYear: setting.foundedYear,
      employeeCount: setting.employeeCount,
      partnerCount: setting.partnerCount,
      categoryImages: {
        FOOD: setting.foodImage?.url ?? null,
        BEAUTY: setting.beautyImage?.url ?? null,
        HOUSEHOLD: setting.householdImage?.url ?? null,
      },
      address: translation?.address ?? null,
      workingHours: translation?.workingHours ?? null,
    };
  }
}
