import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(error: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    super.catch(this.toHttpException(error), host);
  }

  private toHttpException(error: Prisma.PrismaClientKnownRequestError): HttpException | Error {
    switch (error.code) {
      case 'P2002':
        return new ConflictException('Ийм утгатай бичлэг аль хэдийн байна');
      case 'P2003':
        return new BadRequestException('Холбогдох өгөгдөл олдсонгүй эсвэл ашиглагдаж байна');
      case 'P2025':
        return new NotFoundException('Бичлэг олдсонгүй');
      default:
        return error;
    }
  }
}
