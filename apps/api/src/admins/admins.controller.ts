import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { createAdminSchema } from '@cosmo/shared';
import type { CreateAdminInput } from '@cosmo/shared';
import { ACCESS_TOKEN_COOKIE } from '../auth/auth.constants';
import type { AuthAdmin } from '../auth/authenticated-request';
import { CurrentAdmin } from '../auth/current-admin.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { AdminsService } from './admins.service';

@ApiTags('Admin / Admins')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@UseGuards(JwtAuthGuard)
@Controller('admin/admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Post()
  @ApiZodBody(createAdminSchema)
  create(
    @Body(new ZodValidationPipe(createAdminSchema)) body: CreateAdminInput,
  ) {
    return this.adminsService.create(body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAdmin() admin: AuthAdmin,
  ) {
    await this.adminsService.remove(id, admin.id);
  }
}
