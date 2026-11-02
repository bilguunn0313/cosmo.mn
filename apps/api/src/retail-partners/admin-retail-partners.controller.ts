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
  createRetailPartnerSchema,
  reorderSchema,
  updateRetailPartnerSchema,
} from '@cosmo/shared';
import type {
  CreateRetailPartnerInput,
  ReorderInput,
  UpdateRetailPartnerInput,
} from '@cosmo/shared';
import { ACCESS_TOKEN_COOKIE } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { RetailPartnersService } from './retail-partners.service';

@ApiTags('Admin / Retail partners')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@UseGuards(JwtAuthGuard)
@Controller('admin/retail-partners')
export class AdminRetailPartnersController {
  constructor(private readonly retailPartnersService: RetailPartnersService) {}

  @Get()
  findAll() {
    return this.retailPartnersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.retailPartnersService.findOne(id);
  }

  @Post()
  @ApiZodBody(createRetailPartnerSchema)
  create(
    @Body(new ZodValidationPipe(createRetailPartnerSchema))
    body: CreateRetailPartnerInput,
  ) {
    return this.retailPartnersService.create(body);
  }

  @Patch('reorder')
  @HttpCode(204)
  @ApiZodBody(reorderSchema)
  async reorder(
    @Body(new ZodValidationPipe(reorderSchema)) body: ReorderInput,
  ) {
    await this.retailPartnersService.reorder(body.ids);
  }

  @Patch(':id')
  @ApiZodBody(updateRetailPartnerSchema)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateRetailPartnerSchema))
    body: UpdateRetailPartnerInput,
  ) {
    return this.retailPartnersService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.retailPartnersService.remove(id);
  }
}
