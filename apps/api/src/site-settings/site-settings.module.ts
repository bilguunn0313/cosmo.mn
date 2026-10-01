import { Module } from '@nestjs/common';
import { AdminSiteSettingsController } from './admin-site-settings.controller';
import { PublicSiteSettingsController } from './public-site-settings.controller';
import { SiteSettingsService } from './site-settings.service';

@Module({
  controllers: [AdminSiteSettingsController, PublicSiteSettingsController],
  providers: [SiteSettingsService],
})
export class SiteSettingsModule {}
