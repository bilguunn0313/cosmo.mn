import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  LOCALES,
  localeSchema,
  NEWS_TYPES,
  publicNewsQuerySchema,
} from '@cosmo/shared';
import type { Locale, PublicNewsQuery } from '@cosmo/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { NewsService } from './news.service';

@ApiTags('Public / News')
@Controller('public/news')
export class PublicNewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiQuery({ name: 'locale', enum: LOCALES, required: false })
  @ApiQuery({ name: 'type', enum: NEWS_TYPES, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  findPublished(
    @Query(new ZodValidationPipe(publicNewsQuerySchema)) query: PublicNewsQuery,
  ) {
    return this.newsService.findPublished(query);
  }

  @Get(':slug')
  @ApiQuery({ name: 'locale', enum: LOCALES, required: false })
  findPublishedBySlug(
    @Param('slug') slug: string,
    @Query('locale', new ZodValidationPipe(localeSchema)) locale: Locale,
  ) {
    return this.newsService.findPublishedBySlug(slug, locale);
  }
}
