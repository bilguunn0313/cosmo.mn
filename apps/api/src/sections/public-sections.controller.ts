import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  LOCALES,
  publicSectionsQuerySchema,
  SECTION_PAGES,
} from '@cosmo/shared';
import type { PublicSectionsQuery } from '@cosmo/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SectionsService } from './sections.service';

@ApiTags('Public / Sections')
@Controller('public/sections')
export class PublicSectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get()
  @ApiQuery({ name: 'page', enum: SECTION_PAGES })
  @ApiQuery({ name: 'locale', enum: LOCALES, required: false })
  findVisible(
    @Query(new ZodValidationPipe(publicSectionsQuerySchema))
    query: PublicSectionsQuery,
  ) {
    return this.sectionsService.findVisible(query);
  }
}
