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
  createContactDepartmentSchema,
  reorderSchema,
  updateContactDepartmentSchema,
} from '@cosmo/shared';
import type {
  CreateContactDepartmentInput,
  ReorderInput,
  UpdateContactDepartmentInput,
} from '@cosmo/shared';
import { ACCESS_TOKEN_COOKIE } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { ContactDepartmentsService } from './contact-departments.service';

@ApiTags('Admin / Contact departments')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@UseGuards(JwtAuthGuard)
@Controller('admin/contact-departments')
export class AdminContactDepartmentsController {
  constructor(
    private readonly contactDepartmentsService: ContactDepartmentsService,
  ) {}

  @Get()
  findAll() {
    return this.contactDepartmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactDepartmentsService.findOne(id);
  }

  @Post()
  @ApiZodBody(createContactDepartmentSchema)
  create(
    @Body(new ZodValidationPipe(createContactDepartmentSchema))
    body: CreateContactDepartmentInput,
  ) {
    return this.contactDepartmentsService.create(body);
  }

  @Patch('reorder')
  @HttpCode(204)
  @ApiZodBody(reorderSchema)
  async reorder(
    @Body(new ZodValidationPipe(reorderSchema)) body: ReorderInput,
  ) {
    await this.contactDepartmentsService.reorder(body.ids);
  }

  @Patch(':id')
  @ApiZodBody(updateContactDepartmentSchema)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateContactDepartmentSchema))
    body: UpdateContactDepartmentInput,
  ) {
    return this.contactDepartmentsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.contactDepartmentsService.remove(id);
  }
}
