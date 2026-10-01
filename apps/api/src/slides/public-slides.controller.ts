import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { LOCALES, localeSchema } from '@cosmo/shared';
import type { Locale } from '@cosmo/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SlidesService } from './slides.service';

@ApiTags('Public / Slides')
@Controller('public/slides')
export class PublicSlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @Get()
  @ApiQuery({ name: 'locale', enum: LOCALES, required: false })
  findActive(
    @Query('locale', new ZodValidationPipe(localeSchema)) locale: Locale,
  ) {
    return this.slidesService.findActive(locale);
  }
}
