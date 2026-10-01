import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { updateSiteSettingSchema } from '@cosmo/shared';
import type { UpdateSiteSettingInput } from '@cosmo/shared';
import { ACCESS_TOKEN_COOKIE } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SiteSettingsService } from './site-settings.service';

@ApiTags('Admin / Site settings')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@UseGuards(JwtAuthGuard)
@Controller('admin/site-settings')
export class AdminSiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  get() {
    return this.siteSettingsService.get();
  }

  @Put()
  @ApiZodBody(updateSiteSettingSchema)
  update(
    @Body(new ZodValidationPipe(updateSiteSettingSchema))
    body: UpdateSiteSettingInput,
  ) {
    return this.siteSettingsService.update(body);
  }
}
