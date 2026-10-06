import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateProductInput, UpdateProductInput } from '@cosmo/shared';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const productInclude = {
  image: true,
  translations: true,
} satisfies Prisma.ProductInclude;

@Injectable()
export class BrandProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(brandId: number) {
    return this.prisma.product.findMany({
      where: { brandId },
      orderBy: { order: 'asc' },
      include: productInclude,
    });
  }

  async findOne(brandId: number, id: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, brandId },
      include: productInclude,
    });

    if (!product) {
      throw new NotFoundException('Бүтээгдэхүүн олдсонгүй');
    }

    return product;
  }

  async create(brandId: number, input: CreateProductInput) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException('Брэнд олдсонгүй');
    }

    const lastProduct = await this.prisma.product.findFirst({
      where: { brandId },
      orderBy: { order: 'desc' },
    });
    const nextOrder = lastProduct ? lastProduct.order + 1 : 0;

    return this.prisma.product.create({
      data: {
        brandId,
        imageId: input.imageId,
        isVisible: input.isVisible,
        order: nextOrder,
        translations: { create: input.translations },
      },
      include: productInclude,
    });
  }

  async update(brandId: number, id: number, input: UpdateProductInput) {
    await this.findOne(brandId, id);

    const { translations, ...fields } = input;
    const data: Prisma.ProductUncheckedUpdateInput = { ...fields };

    if (translations) {
      data.translations = {
        deleteMany: {},
        create: translations,
      };
    }

    return this.prisma.product.update({
      where: { id },
      data,
      include: productInclude,
    });
  }

  async reorder(brandId: number, ids: number[]) {
    await this.prisma.$transaction(async (tx) => {
      for (const [index, id] of ids.entries()) {
        await tx.product.update({
          where: { id, brandId },
          data: { order: index },
        });
      }
    });
  }

  async remove(brandId: number, id: number) {
    await this.findOne(brandId, id);
    await this.prisma.product.delete({ where: { id } });
  }
}
