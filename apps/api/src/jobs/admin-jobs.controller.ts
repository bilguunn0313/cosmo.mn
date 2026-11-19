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
import { createJobPostingSchema, updateJobPostingSchema } from '@cosmo/shared';
import type {
  CreateJobPostingInput,
  UpdateJobPostingInput,
} from '@cosmo/shared';
import { ACCESS_TOKEN_COOKIE } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { JobsService } from './jobs.service';

@ApiTags('Admin / Jobs')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@UseGuards(JwtAuthGuard)
@Controller('admin/jobs')
export class AdminJobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(id);
  }

  @Post()
  @ApiZodBody(createJobPostingSchema)
  create(
    @Body(new ZodValidationPipe(createJobPostingSchema))
    body: CreateJobPostingInput,
  ) {
    return this.jobsService.create(body);
  }

  @Patch(':id')
  @ApiZodBody(updateJobPostingSchema)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateJobPostingSchema))
    body: UpdateJobPostingInput,
  ) {
    return this.jobsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.jobsService.remove(id);
  }
}
