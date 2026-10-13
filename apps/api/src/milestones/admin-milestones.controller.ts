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
import { createMilestoneSchema, updateMilestoneSchema } from '@cosmo/shared';
import type { CreateMilestoneInput, UpdateMilestoneInput } from '@cosmo/shared';
import { ACCESS_TOKEN_COOKIE } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { MilestonesService } from './milestones.service';

@ApiTags('Admin / Milestones')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@UseGuards(JwtAuthGuard)
@Controller('admin/milestones')
export class AdminMilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Get()
  findAll() {
    return this.milestonesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.milestonesService.findOne(id);
  }

  @Post()
  @ApiZodBody(createMilestoneSchema)
  create(
    @Body(new ZodValidationPipe(createMilestoneSchema))
    body: CreateMilestoneInput,
  ) {
    return this.milestonesService.create(body);
  }

  @Patch(':id')
  @ApiZodBody(updateMilestoneSchema)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateMilestoneSchema))
    body: UpdateMilestoneInput,
  ) {
    return this.milestonesService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.milestonesService.remove(id);
  }
}
