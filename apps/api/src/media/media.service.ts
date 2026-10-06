import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
  VIDEO_MIME_TYPES,
} from '@cosmo/shared';
import type { AdminMediaQuery } from '@cosmo/shared';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MediaUsageService } from './media-usage.service';
import { StorageService } from './storage.service';

export interface UploadedFileData {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

const MAX_IMAGE_DIMENSION = 2000;

const VIDEO_EXTENSIONS: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

function isImage(mimeType: string) {
  return (IMAGE_MIME_TYPES as readonly string[]).includes(mimeType);
}

function isVideo(mimeType: string) {
  return (VIDEO_MIME_TYPES as readonly string[]).includes(mimeType);
}

function decodeFileName(name: string) {
  return Buffer.from(name, 'latin1').toString('utf8');
}

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly mediaUsageService: MediaUsageService,
  ) {}

  async findAll(query: AdminMediaQuery) {
    const where: Prisma.MediaWhereInput = { type: query.type };

    const [items, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.media.count({ where }),
    ]);

    return { items, total, page: query.page, limit: query.limit };
  }

  upload(file: UploadedFileData) {
    if (isImage(file.mimetype)) {
      return this.saveImage(file);
    }

    if (isVideo(file.mimetype)) {
      return this.saveVideo(file);
    }

    throw new BadRequestException(
      'Зөвхөн JPG, PNG, WEBP зураг эсвэл MP4, WEBM видео оруулна уу',
    );
  }

  async findUsages(id: number) {
    const media = await this.findOne(id);
    return this.mediaUsageService.findUsages(media);
  }

  async remove(id: number) {
    const media = await this.findOne(id);
    const usages = await this.mediaUsageService.findUsages(media);

    if (usages.length > 0) {
      throw new ConflictException({
        statusCode: 409,
        message: 'Энэ файл ашиглагдаж байгаа тул устгах боломжгүй',
        usages,
      });
    }

    await this.prisma.media.delete({ where: { id } });
    await this.storage.remove(media.url);
  }

  private async findOne(id: number) {
    const media = await this.prisma.media.findUnique({ where: { id } });

    if (!media) {
      throw new NotFoundException('Файл олдсонгүй');
    }

    return media;
  }

  private async saveImage(file: UploadedFileData) {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new BadRequestException('Зургийн хэмжээ 10MB-аас ихгүй байна');
    }

    const { data, info } = await this.convertToWebp(file.buffer);
    const url = await this.storage.save(`images/${randomUUID()}.webp`, data);

    return this.prisma.media.create({
      data: {
        type: 'IMAGE',
        url,
        originalName: decodeFileName(file.originalname),
        mimeType: 'image/webp',
        size: info.size,
        width: info.width,
        height: info.height,
      },
    });
  }

  private async saveVideo(file: UploadedFileData) {
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      throw new BadRequestException('Видеоны хэмжээ 50MB-аас ихгүй байна');
    }

    const extension = VIDEO_EXTENSIONS[file.mimetype];
    const url = await this.storage.save(
      `videos/${randomUUID()}.${extension}`,
      file.buffer,
    );

    return this.prisma.media.create({
      data: {
        type: 'VIDEO',
        url,
        originalName: decodeFileName(file.originalname),
        mimeType: file.mimetype,
        size: file.size,
      },
    });
  }

  private async convertToWebp(buffer: Buffer) {
    try {
      return await sharp(buffer)
        .rotate()
        .resize({
          width: MAX_IMAGE_DIMENSION,
          height: MAX_IMAGE_DIMENSION,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true });
    } catch {
      throw new BadRequestException('Зургийг уншиж чадсангүй');
    }
  }
}
