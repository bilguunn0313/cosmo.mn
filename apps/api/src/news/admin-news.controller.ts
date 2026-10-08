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
  adminNewsQuerySchema,
  createNewsSchema,
  updateNewsSchema,
} from '@cosmo/shared';
import type {
  AdminNewsQuery,
  CreateNewsInput,
  UpdateNewsInput,
} from '@cosmo/shared';
import { ACCESS_TOKEN_COOKIE } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { NewsService } from './news.service';

@ApiTags('Admin / News')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@UseGuards(JwtAuthGuard)
@Controller('admin/news')
export class AdminNewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  findAll(
    @Query(new ZodValidationPipe(adminNewsQuerySchema)) query: AdminNewsQuery,
  ) {
    return this.newsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.findOne(id);
  }

  @Post()
  @ApiZodBody(createNewsSchema)
  create(@Body(new ZodValidationPipe(createNewsSchema)) body: CreateNewsInput) {
    return this.newsService.create(body);
  }

  @Patch(':id')
  @ApiZodBody(updateNewsSchema)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateNewsSchema)) body: UpdateNewsInput,
  ) {
    return this.newsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.newsService.remove(id);
  }
}
