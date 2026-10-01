import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  BRAND_CATEGORIES,
  LOCALES,
  localeSchema,
  publicBrandsQuerySchema,
} from '@cosmo/shared';
import type { Locale, PublicBrandsQuery } from '@cosmo/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { BrandsService } from './brands.service';

@ApiTags('Public / Brands')
@Controller('public/brands')
export class PublicBrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @ApiQuery({ name: 'locale', enum: LOCALES, required: false })
  @ApiQuery({ name: 'category', enum: BRAND_CATEGORIES, required: false })
  findPublished(
    @Query(new ZodValidationPipe(publicBrandsQuerySchema))
    query: PublicBrandsQuery,
  ) {
    return this.brandsService.findPublished(query);
  }

  @Get(':slug')
  @ApiQuery({ name: 'locale', enum: LOCALES, required: false })
  findPublishedBySlug(
    @Param('slug') slug: string,
    @Query('locale', new ZodValidationPipe(localeSchema)) locale: Locale,
  ) {
    return this.brandsService.findPublishedBySlug(slug, locale);
  }
}
