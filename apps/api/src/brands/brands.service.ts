import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateBrandInput,
  Locale,
  PublicBrandsQuery,
  UpdateBrandInput,
} from '@cosmo/shared';
import { pickTranslation } from '../common/pick-translation';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const brandInclude = {
  logo: true,
  cover: true,
  translations: true,
} satisfies Prisma.BrandInclude;

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.brand.findMany({
      orderBy: { order: 'asc' },
      include: brandInclude,
    });
  }

  async findOne(id: number) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: brandInclude,
    });

    if (!brand) {
      throw new NotFoundException('Брэнд олдсонгүй');
    }

    return brand;
  }

  async create(input: CreateBrandInput) {
    const lastBrand = await this.prisma.brand.findFirst({
      orderBy: { order: 'desc' },
    });
    const nextOrder = lastBrand ? lastBrand.order + 1 : 0;

    return this.prisma.brand.create({
      data: {
        slug: input.slug,
        categories: input.categories,
        logoId: input.logoId,
        coverId: input.coverId,
        websiteUrl: input.websiteUrl,
        isPublished: input.isPublished,
        order: nextOrder,
        translations: { create: input.translations },
      },
      include: brandInclude,
    });
  }

  async update(id: number, input: UpdateBrandInput) {
    await this.findOne(id);

    const { translations, ...fields } = input;
    const data: Prisma.BrandUncheckedUpdateInput = { ...fields };

    if (translations) {
      data.translations = {
        deleteMany: {},
        create: translations,
      };
    }

    return this.prisma.brand.update({
      where: { id },
      data,
      include: brandInclude,
    });
  }

  async reorder(ids: number[]) {
    await this.prisma.$transaction(async (tx) => {
      for (const [index, id] of ids.entries()) {
        await tx.brand.update({ where: { id }, data: { order: index } });
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.brand.delete({ where: { id } });
  }

  async findPublished(query: PublicBrandsQuery) {
    const brands = await this.prisma.brand.findMany({
      where: {
        isPublished: true,
        categories: query.category ? { has: query.category } : undefined,
      },
      orderBy: { order: 'asc' },
      include: brandInclude,
    });

    return brands.map((brand) => {
      const translation = pickTranslation(brand.translations, query.locale);

      return {
        slug: brand.slug,
        categories: brand.categories,
        name: translation?.name ?? '',
        summary: translation?.summary ?? null,
        logoUrl: brand.logo?.url ?? null,
        coverUrl: brand.cover?.url ?? null,
      };
    });
  }

  async findPublishedBySlug(slug: string, locale: Locale) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
      include: {
        ...brandInclude,
        sections: {
          where: { isVisible: true },
          orderBy: { order: 'asc' },
          include: { image: true, translations: true },
        },
        products: {
          where: { isVisible: true },
          orderBy: { order: 'asc' },
          include: { image: true, translations: true },
        },
      },
    });

    if (!brand || !brand.isPublished) {
      throw new NotFoundException('Брэнд олдсонгүй');
    }

    const translation = pickTranslation(brand.translations, locale);

    return {
      slug: brand.slug,
      categories: brand.categories,
      name: translation?.name ?? '',
      summary: translation?.summary ?? null,
      logoUrl: brand.logo?.url ?? null,
      coverUrl: brand.cover?.url ?? null,
      websiteUrl: brand.websiteUrl,
      sections: brand.sections.map((section) => {
        const sectionTranslation = pickTranslation(
          section.translations,
          locale,
        );

        return {
          id: section.id,
          title: sectionTranslation?.title ?? '',
          body: sectionTranslation?.body ?? '',
          imageUrl: section.image?.url ?? null,
        };
      }),
      products: brand.products.map((product) => {
        const productTranslation = pickTranslation(
          product.translations,
          locale,
        );

        return {
          id: product.id,
          name: productTranslation?.name ?? '',
          description: productTranslation?.description ?? null,
          imageUrl: product.image.url,
        };
      }),
    };
  }
}
