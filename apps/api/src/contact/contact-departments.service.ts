import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateContactDepartmentInput,
  Locale,
  UpdateContactDepartmentInput,
} from '@cosmo/shared';
import { pickTranslation } from '../common/pick-translation';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const departmentInclude = {
  translations: true,
} satisfies Prisma.ContactDepartmentInclude;

@Injectable()
export class ContactDepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.contactDepartment.findMany({
      orderBy: { order: 'asc' },
      include: departmentInclude,
    });
  }

  async findOne(id: number) {
    const department = await this.prisma.contactDepartment.findUnique({
      where: { id },
      include: departmentInclude,
    });

    if (!department) {
      throw new NotFoundException('Алба олдсонгүй');
    }

    return department;
  }

  async create(input: CreateContactDepartmentInput) {
    const lastDepartment = await this.prisma.contactDepartment.findFirst({
      orderBy: { order: 'desc' },
    });
    const nextOrder = lastDepartment ? lastDepartment.order + 1 : 0;

    return this.prisma.contactDepartment.create({
      data: {
        email: input.email,
        isActive: input.isActive,
        order: nextOrder,
        translations: { create: input.translations },
      },
      include: departmentInclude,
    });
  }

  async update(id: number, input: UpdateContactDepartmentInput) {
    await this.findOne(id);

    const { translations, ...fields } = input;
    const data: Prisma.ContactDepartmentUpdateInput = { ...fields };

    if (translations) {
      data.translations = {
        deleteMany: {},
        create: translations,
      };
    }

    return this.prisma.contactDepartment.update({
      where: { id },
      data,
      include: departmentInclude,
    });
  }

  async reorder(ids: number[]) {
    await this.prisma.$transaction(async (tx) => {
      for (const [index, id] of ids.entries()) {
        await tx.contactDepartment.update({
          where: { id },
          data: { order: index },
        });
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.contactDepartment.delete({ where: { id } });
  }

  async findActive(locale: Locale) {
    const departments = await this.prisma.contactDepartment.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: departmentInclude,
    });

    return departments.map((department) => ({
      id: department.id,
      name: pickTranslation(department.translations, locale)?.name ?? '',
    }));
  }
}
