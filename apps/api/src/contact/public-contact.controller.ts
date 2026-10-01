import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { contactSchema, LOCALES, localeSchema } from '@cosmo/shared';
import type { ContactInput, Locale } from '@cosmo/shared';
import { ApiZodBody } from '../common/api-zod-body';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { ContactDepartmentsService } from './contact-departments.service';
import { ContactService } from './contact.service';

@ApiTags('Public / Contact')
@Controller('public/contact')
export class PublicContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly contactDepartmentsService: ContactDepartmentsService,
  ) {}

  @Get('departments')
  @ApiQuery({ name: 'locale', enum: LOCALES, required: false })
  findDepartments(
    @Query('locale', new ZodValidationPipe(localeSchema)) locale: Locale,
  ) {
    return this.contactDepartmentsService.findActive(locale);
  }

  @Post()
  @HttpCode(204)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @ApiZodBody(contactSchema)
  async send(@Body(new ZodValidationPipe(contactSchema)) body: ContactInput) {
    await this.contactService.send(body);
  }
}
