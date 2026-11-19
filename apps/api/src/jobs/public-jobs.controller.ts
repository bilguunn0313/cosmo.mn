import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { LOCALES, localeSchema, MAX_PHOTO_BYTES } from '@cosmo/shared';
import type { Locale } from '@cosmo/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import type { ApplicationPhoto } from './application-email';
import { JobApplicationsService } from './job-applications.service';
import { JobsService } from './jobs.service';

@ApiTags('Public / Jobs')
@Controller('public/jobs')
export class PublicJobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly jobApplicationsService: JobApplicationsService,
  ) {}

  @Get()
  @ApiQuery({ name: 'locale', enum: LOCALES, required: false })
  findOpen(
    @Query('locale', new ZodValidationPipe(localeSchema)) locale: Locale,
  ) {
    return this.jobsService.findOpen(locale);
  }

  @Get(':slug')
  @ApiQuery({ name: 'locale', enum: LOCALES, required: false })
  findOpenBySlug(
    @Param('slug') slug: string,
    @Query('locale', new ZodValidationPipe(localeSchema)) locale: Locale,
  ) {
    return this.jobsService.findOpenBySlug(slug, locale);
  }

  @Post(':slug/apply')
  @HttpCode(204)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @UseInterceptors(
    FileInterceptor('photo', { limits: { fileSize: MAX_PHOTO_BYTES } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['data', 'photo'],
      properties: {
        data: { type: 'string', description: 'JobApplicationInput JSON' },
        photo: { type: 'string', format: 'binary' },
      },
    },
  })
  async apply(
    @Param('slug') slug: string,
    @Body('data') data: string | undefined,
    @UploadedFile() photo: ApplicationPhoto | undefined,
  ) {
    await this.jobApplicationsService.apply(slug, data, photo);
  }
}
