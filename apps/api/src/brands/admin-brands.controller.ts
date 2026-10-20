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
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import {
  createBrandSchema,
  featuredBrandsSchema,
  reorderSchema,
  updateBrandSchema,
} from '@cosmo/shared';
import type {
  CreateBrandInput,
  FeaturedBrandsInput,
  ReorderInput,
  UpdateBrandInput,
} from '@cosmo/shared';
import { ACCESS_TOKEN_COOKIE } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { BrandsService } from './brands.service';

@ApiTags('Admin / Brands')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@UseGuards(JwtAuthGuard)
@Controller('admin/brands')
export class AdminBrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.findOne(id);
  }

  @Post()
  @ApiZodBody(createBrandSchema)
  create(
    @Body(new ZodValidationPipe(createBrandSchema)) body: CreateBrandInput,
  ) {
    return this.brandsService.create(body);
  }

  @Patch('reorder')
  @HttpCode(204)
  @ApiZodBody(reorderSchema)
  async reorder(
    @Body(new ZodValidationPipe(reorderSchema)) body: ReorderInput,
  ) {
    await this.brandsService.reorder(body.ids);
  }

  @Put('featured')
  @HttpCode(204)
  @ApiZodBody(featuredBrandsSchema)
  async setFeatured(
    @Body(new ZodValidationPipe(featuredBrandsSchema))
    body: FeaturedBrandsInput,
  ) {
    await this.brandsService.setFeatured(body.ids);
  }

  @Patch(':id')
  @ApiZodBody(updateBrandSchema)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateBrandSchema)) body: UpdateBrandInput,
  ) {
    return this.brandsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.brandsService.remove(id);
  }
}
