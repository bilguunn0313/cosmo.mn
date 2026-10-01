import { BadRequestException, Injectable } from '@nestjs/common';
import type { CreateAdminInput } from '@cosmo/shared';
import * as bcrypt from 'bcrypt';
import { PASSWORD_SALT_ROUNDS } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

const adminSelect = { id: true, email: true, name: true, createdAt: true };

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.admin.findMany({
      orderBy: { createdAt: 'asc' },
      select: adminSelect,
    });
  }

  async create(input: CreateAdminInput) {
    return this.prisma.admin.create({
      data: {
        email: input.email.toLowerCase(),
        name: input.name,
        passwordHash: await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS),
      },
      select: adminSelect,
    });
  }

  async remove(id: number, currentAdminId: number) {
    if (id === currentAdminId) {
      throw new BadRequestException('Өөрийгөө устгах боломжгүй');
    }

    await this.prisma.admin.delete({ where: { id } });
  }
}
