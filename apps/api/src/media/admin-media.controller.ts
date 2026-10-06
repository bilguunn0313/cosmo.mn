import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  adminMediaQuerySchema,
  MAX_VIDEO_SIZE_BYTES,
  MEDIA_TYPES,
} from '@cosmo/shared';
import type { AdminMediaQuery } from '@cosmo/shared';
import { ACCESS_TOKEN_COOKIE } from '../auth/auth.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { MediaService } from './media.service';
import type { UploadedFileData } from './media.service';

@ApiTags('Admin / Media')
@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@UseGuards(JwtAuthGuard)
@Controller('admin/media')
export class AdminMediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiQuery({ name: 'type', enum: MEDIA_TYPES, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  findAll(
    @Query(new ZodValidationPipe(adminMediaQuerySchema)) query: AdminMediaQuery,
  ) {
    return this.mediaService.findAll(query);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_VIDEO_SIZE_BYTES } }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  upload(@UploadedFile() file: UploadedFileData | undefined) {
    if (!file) {
      throw new BadRequestException('Файл сонгоно уу');
    }

    return this.mediaService.upload(file);
  }

  @Get(':id/usages')
  findUsages(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.findUsages(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.mediaService.remove(id);
  }
}
