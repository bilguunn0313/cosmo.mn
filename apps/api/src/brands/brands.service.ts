import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  BrandCategory,
  CreateBrandInput,
  Locale,
  PublicBrandsQuery,
  UpdateBrandInput,
} from '@cosmo/shared';
import { framedImageUrl } from '../common/framed-image-url';
import { pickTranslation } from '../common/pick-translation';
import { Prisma } from '../generated/prisma/client';
import { isCutoutImage } from '../media/image-background';
import { clearLogo } from '../media/logo-image';
import { PrismaService } from '../prisma/prisma.service';

const brandInclude = {
  logo: true,
  cover: true,
  showcaseImage: true,
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
        showcaseImageId: input.showcaseImageId,
        websiteUrl: input.websiteUrl,
        originCountry: input.originCountry,
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

  async setFeatured(ids: number[]) {
    const foundCount = await this.prisma.brand.count({
      where: { id: { in: ids } },
    });

    if (foundCount !== ids.length) {
      throw new BadRequestException('Сонгосон брэнд олдсонгүй');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.brand.updateMany({
        where: { featuredOrder: { not: null } },
        data: { featuredOrder: null },
      });

      for (const [index, id] of ids.entries()) {
        await tx.brand.update({
          where: { id },
          data: { featuredOrder: index },
        });
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
        categories: query.category
          ? { array_contains: [query.category] }
          : undefined,
      },
      orderBy: { order: 'asc' },
      include: brandInclude,
    });

    return Promise.all(
      brands.map(async (brand) => {
        const translation = pickTranslation(brand.translations, query.locale);
        const logo = await clearLogo(brand.logo);

        return {
          slug: brand.slug,
          categories: brand.categories as BrandCategory[],
          name: translation?.name ?? '',
          summary: translation?.summary ?? null,
          productTypes: translation?.productTypes ?? null,
          logoUrl: logo?.url ?? null,
          logoWidth: logo?.width ?? null,
          logoHeight: logo?.height ?? null,
          coverUrl: framedImageUrl(brand.cover),
          coverWidth: brand.cover?.width ?? null,
          coverHeight: brand.cover?.height ?? null,
          showcaseImageUrl: brand.showcaseImage?.url ?? null,
          featuredOrder: brand.featuredOrder,
        };
      }),
    );
  }

  async findOriginCountries() {
    const brands = await this.prisma.brand.findMany({
      where: { isPublished: true, originCountry: { not: null } },
      distinct: ['originCountry'],
      orderBy: { originCountry: 'asc' },
      select: { originCountry: true },
    });

    return brands
      .map((brand) => brand.originCountry)
      .filter((code) => code !== null);
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
    const logo = await clearLogo(brand.logo);

    return {
      slug: brand.slug,
      categories: brand.categories as BrandCategory[],
      name: translation?.name ?? '',
      summary: translation?.summary ?? null,
      productTypes: translation?.productTypes ?? null,
      logoUrl: logo?.url ?? null,
      logoWidth: logo?.width ?? null,
      logoHeight: logo?.height ?? null,
      coverUrl: framedImageUrl(brand.cover),
      coverWidth: brand.cover?.width ?? null,
      coverHeight: brand.cover?.height ?? null,
      showcaseImageUrl: brand.showcaseImage?.url ?? null,
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
          imageUrl: framedImageUrl(section.image),
        };
      }),
      products: await Promise.all(
        brand.products.map(async (product) => {
          const productTranslation = pickTranslation(
            product.translations,
            locale,
          );

          return {
            id: product.id,
            name: productTranslation?.name ?? '',
            description: productTranslation?.description ?? null,
            imageUrl: framedImageUrl(product.image),
            imageIsCutout: await isCutoutImage(product.image.url),
          };
        }),
      ),
    };
  }
}
