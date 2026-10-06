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
  createProductSchema,
  reorderSchema,
  updateProductSchema,
} from '@cosmo/shared';
import type {
  CreateProductInput,
  ReorderInput,
  UpdateProductInput,
} from '@cosmo/shared';
import { ACCESS_TOKEN_COOKIE } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { BrandProductsService } from './brand-products.service';

@ApiTags('Admin / Brand products')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@UseGuards(JwtAuthGuard)
@Controller('admin/brands/:brandId/products')
export class AdminBrandProductsController {
  constructor(private readonly brandProductsService: BrandProductsService) {}

  @Get()
  findAll(@Param('brandId', ParseIntPipe) brandId: number) {
    return this.brandProductsService.findAll(brandId);
  }

  @Get(':id')
  findOne(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.brandProductsService.findOne(brandId, id);
  }

  @Post()
  @ApiZodBody(createProductSchema)
  create(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Body(new ZodValidationPipe(createProductSchema)) body: CreateProductInput,
  ) {
    return this.brandProductsService.create(brandId, body);
  }

  @Patch('reorder')
  @HttpCode(204)
  @ApiZodBody(reorderSchema)
  async reorder(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Body(new ZodValidationPipe(reorderSchema)) body: ReorderInput,
  ) {
    await this.brandProductsService.reorder(brandId, body.ids);
  }

  @Patch(':id')
  @ApiZodBody(updateProductSchema)
  update(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateProductSchema)) body: UpdateProductInput,
  ) {
    return this.brandProductsService.update(brandId, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.brandProductsService.remove(brandId, id);
  }
}
