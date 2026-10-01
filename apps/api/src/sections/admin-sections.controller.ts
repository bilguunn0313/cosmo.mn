import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  adminSectionsQuerySchema,
  createSectionSchema,
  reorderSchema,
  SECTION_PAGES,
  updateSectionSchema,
} from '@cosmo/shared';
import type {
  AdminSectionsQuery,
  CreateSectionInput,
  ReorderInput,
  UpdateSectionInput,
} from '@cosmo/shared';
import { ACCESS_TOKEN_COOKIE } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SectionsService } from './sections.service';

@ApiTags('Admin / Sections')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@UseGuards(JwtAuthGuard)
@Controller('admin/sections')
export class AdminSectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get()
  @ApiQuery({ name: 'page', enum: SECTION_PAGES })
  findAll(
    @Query(new ZodValidationPipe(adminSectionsQuerySchema))
    query: AdminSectionsQuery,
  ) {
    return this.sectionsService.findAll(query.page);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sectionsService.findOne(id);
  }

  @Post()
  @ApiZodBody(createSectionSchema)
  create(
    @Body(new ZodValidationPipe(createSectionSchema)) body: CreateSectionInput,
  ) {
    return this.sectionsService.create(body);
  }

  @Patch('reorder')
  @HttpCode(204)
  @ApiZodBody(reorderSchema)
  async reorder(
    @Body(new ZodValidationPipe(reorderSchema)) body: ReorderInput,
  ) {
    await this.sectionsService.reorder(body.ids);
  }

  @Patch(':id')
  @ApiZodBody(updateSectionSchema)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateSectionSchema)) body: UpdateSectionInput,
  ) {
    return this.sectionsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.sectionsService.remove(id);
  }
}
