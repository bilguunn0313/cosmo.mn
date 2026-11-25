import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { AdminSiteSettingsController } from './admin-site-settings.controller';
import { PublicSiteSettingsController } from './public-site-settings.controller';
import { SiteSettingsService } from './site-settings.service';

@Module({
  imports: [MediaModule],
  controllers: [AdminSiteSettingsController, PublicSiteSettingsController],
  providers: [SiteSettingsService],
})
export class SiteSettingsModule {}
