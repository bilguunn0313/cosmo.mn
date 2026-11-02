import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateRetailPartnerInput,
  UpdateRetailPartnerInput,
} from '@cosmo/shared';
import { PrismaService } from '../prisma/prisma.service';

const retailPartnerInclude = { logo: true };

@Injectable()
export class RetailPartnersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.retailPartner.findMany({
      orderBy: { order: 'asc' },
      include: retailPartnerInclude,
    });
  }

  async findVisible() {
    const partners = await this.prisma.retailPartner.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
      include: retailPartnerInclude,
    });

    return partners.map((partner) => ({
      id: partner.id,
      name: partner.name,
      logoUrl: partner.logo.url,
    }));
  }

  async findOne(id: number) {
    const partner = await this.prisma.retailPartner.findUnique({
      where: { id },
      include: retailPartnerInclude,
    });

    if (!partner) {
      throw new NotFoundException('Харилцагч олдсонгүй');
    }

    return partner;
  }

  async create(input: CreateRetailPartnerInput) {
    const lastPartner = await this.prisma.retailPartner.findFirst({
      orderBy: { order: 'desc' },
    });
    const nextOrder = lastPartner ? lastPartner.order + 1 : 0;

    return this.prisma.retailPartner.create({
      data: { ...input, order: nextOrder },
      include: retailPartnerInclude,
    });
  }

  async update(id: number, input: UpdateRetailPartnerInput) {
    await this.findOne(id);

    return this.prisma.retailPartner.update({
      where: { id },
      data: input,
      include: retailPartnerInclude,
    });
  }

  async reorder(ids: number[]) {
    await this.prisma.$transaction(async (tx) => {
      for (const [index, id] of ids.entries()) {
        await tx.retailPartner.update({
          where: { id },
          data: { order: index },
        });
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.retailPartner.delete({ where: { id } });
  }
}
