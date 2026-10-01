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
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import {
  createBrandSectionSchema,
  reorderSchema,
  updateBrandSectionSchema,
} from '@cosmo/shared';
import type {
  CreateBrandSectionInput,
  ReorderInput,
  UpdateBrandSectionInput,
} from '@cosmo/shared';
import { ACCESS_TOKEN_COOKIE } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { BrandSectionsService } from './brand-sections.service';

@ApiTags('Admin / Brand sections')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@UseGuards(JwtAuthGuard)
@Controller('admin/brands/:brandId/sections')
export class AdminBrandSectionsController {
  constructor(private readonly brandSectionsService: BrandSectionsService) {}

  @Get()
  findAll(@Param('brandId', ParseIntPipe) brandId: number) {
    return this.brandSectionsService.findAll(brandId);
  }

  @Get(':id')
  findOne(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.brandSectionsService.findOne(brandId, id);
  }

  @Post()
  @ApiZodBody(createBrandSectionSchema)
  create(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Body(new ZodValidationPipe(createBrandSectionSchema))
    body: CreateBrandSectionInput,
  ) {
    return this.brandSectionsService.create(brandId, body);
  }

  @Patch('reorder')
  @HttpCode(204)
  @ApiZodBody(reorderSchema)
  async reorder(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Body(new ZodValidationPipe(reorderSchema)) body: ReorderInput,
  ) {
    await this.brandSectionsService.reorder(brandId, body.ids);
  }

  @Patch(':id')
  @ApiZodBody(updateBrandSectionSchema)
  update(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateBrandSectionSchema))
    body: UpdateBrandSectionInput,
  ) {
    return this.brandSectionsService.update(brandId, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.brandSectionsService.remove(brandId, id);
  }
}
