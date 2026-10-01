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
  createSlideSchema,
  reorderSchema,
  updateSlideSchema,
} from '@cosmo/shared';
import type {
  CreateSlideInput,
  ReorderInput,
  UpdateSlideInput,
} from '@cosmo/shared';
import { ACCESS_TOKEN_COOKIE } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { SlidesService } from './slides.service';

@ApiTags('Admin / Slides')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@UseGuards(JwtAuthGuard)
@Controller('admin/slides')
export class AdminSlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @Get()
  findAll() {
    return this.slidesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.slidesService.findOne(id);
  }

  @Post()
  @ApiZodBody(createSlideSchema)
  create(
    @Body(new ZodValidationPipe(createSlideSchema)) body: CreateSlideInput,
  ) {
    return this.slidesService.create(body);
  }

  @Patch('reorder')
  @HttpCode(204)
  @ApiZodBody(reorderSchema)
  async reorder(
    @Body(new ZodValidationPipe(reorderSchema)) body: ReorderInput,
  ) {
    await this.slidesService.reorder(body.ids);
  }

  @Patch(':id')
  @ApiZodBody(updateSlideSchema)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateSlideSchema)) body: UpdateSlideInput,
  ) {
    return this.slidesService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.slidesService.remove(id);
  }
}
