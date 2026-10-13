import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { LOCALES, localeSchema } from '@cosmo/shared';
import type { Locale } from '@cosmo/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { MilestonesService } from './milestones.service';

@ApiTags('Public / Milestones')
@Controller('public/milestones')
export class PublicMilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Get()
  @ApiQuery({ name: 'locale', enum: LOCALES, required: false })
  findVisible(
    @Query('locale', new ZodValidationPipe(localeSchema)) locale: Locale,
  ) {
    return this.milestonesService.findVisible(locale);
  }
}
