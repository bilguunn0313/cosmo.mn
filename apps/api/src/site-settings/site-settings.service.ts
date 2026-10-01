import { Injectable } from '@nestjs/common';
import type { Locale, UpdateSiteSettingInput } from '@cosmo/shared';
import { pickTranslation } from '../common/pick-translation';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const SITE_SETTING_ID = 1;

@Injectable()
export class SiteSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  get() {
    return this.prisma.siteSetting.upsert({
      where: { id: SITE_SETTING_ID },
      update: {},
      create: { id: SITE_SETTING_ID },
      include: { translations: true },
    });
  }

  async update(input: UpdateSiteSettingInput) {
    await this.get();

    const { translations, ...fields } = input;
    const data: Prisma.SiteSettingUpdateInput = { ...fields };

    if (translations) {
      data.translations = {
        deleteMany: {},
        create: translations,
      };
    }

    return this.prisma.siteSetting.update({
      where: { id: SITE_SETTING_ID },
      data,
      include: { translations: true },
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
      mapEmbedUrl: setting.mapEmbedUrl,
      address: translation?.address ?? null,
      workingHours: translation?.workingHours ?? null,
    };
  }
}
