import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { LOCALES, localeSchema } from '@cosmo/shared';
import type { Locale } from '@cosmo/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SiteSettingsService } from './site-settings.service';

@ApiTags('Public / Site settings')
@Controller('public/site-settings')
export class PublicSiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  @ApiQuery({ name: 'locale', enum: LOCALES, required: false })
  get(@Query('locale', new ZodValidationPipe(localeSchema)) locale: Locale) {
    return this.siteSettingsService.getPublic(locale);
  }
}
