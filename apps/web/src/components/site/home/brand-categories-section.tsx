import { BRAND_CATEGORIES, type BrandCategory } from "@cosmo/shared";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ImageReveal } from "@/components/site/image-reveal";
import { Reveal } from "@/components/site/reveal";
import { Link } from "@/i18n/navigation";
import type { PublicBrand, PublicSiteSetting } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const TILE_STAGGER_SECONDS = 0.12;
const TEXT_AFTER_IMAGE_SECONDS = 0.35;

const GRID_CLASSES: Record<number, string> = {
  1: "grid",
  2: "grid gap-4 md:h-[32rem] md:grid-cols-2",
  3: "grid gap-4 lg:h-[44rem] lg:grid-cols-[1.3fr_1fr] lg:grid-rows-2",
};

const TILE_HEIGHT_CLASSES: Record<number, string> = {
  1: "h-80 sm:h-[28rem]",
  2: "h-80 sm:h-96 md:h-auto",
  3: "h-80 sm:h-96 lg:h-auto",
};

interface CategoryTile {
  category: BrandCategory;
  brands: PublicBrand[];
  imageUrl: string | null;
}

function buildTiles(
  brands: PublicBrand[],
  setting: PublicSiteSetting | null,
): CategoryTile[] {
  return BRAND_CATEGORIES.map((category) => {
    const inCategory = brands.filter((brand) =>
      brand.categories.includes(category),
    );

    return {
      category,
      brands: inCategory,
      imageUrl:
        setting?.categoryImages?.[category] ??
        inCategory.find((brand) => brand.coverUrl)?.coverUrl ??
        null,
    };
  }).filter((tile) => tile.brands.length > 0);
}

interface CategoryCardProps {
  tile: CategoryTile;
  index: number;
  isFeatured: boolean;
  heightClass: string;
}

async function CategoryCard({
  tile,
  index,
  isFeatured,
  heightClass,
}: CategoryCardProps) {
  const t = await getTranslations();
  const delay = index * TILE_STAGGER_SECONDS;

  return (
    <Link
      href={{ pathname: "/brands", query: { category: tile.category } }}
      className={cn(
        "group relative isolate flex overflow-hidden rounded-3xl bg-muted outline-offset-4 outline-primary transition-[scale] duration-150 ease-(--ease-out) focus-visible:outline-2 motion-safe:active:scale-[0.99] md:rounded-[2rem]",
        heightClass,
        isFeatured && "lg:row-span-2",
      )}
    >
      <ImageReveal delay={delay}>
        {tile.imageUrl ? (
          <Image
            src={tile.imageUrl}
            alt=""
            fill
            unoptimized
            loading="eager"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-[scale] duration-700 ease-(--ease-out) group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        ) : (
          <div className="bg-brand-gradient absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
      </ImageReveal>

      <Reveal
        delay={delay + TEXT_AFTER_IMAGE_SECONDS}
        className="relative mt-auto flex w-full items-end justify-between gap-6 p-6 text-white sm:p-8 lg:p-10"
      >
        <h3
          className={cn(
            "leading-[1.05] font-semibold tracking-tight",
            isFeatured ? "text-4xl md:text-6xl" : "text-3xl md:text-4xl",
          )}
        >
          {t(`categories.${tile.category}`)}
        </h3>
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition-[background-color,color,border-color,translate] duration-300 ease-(--ease-out) group-hover:translate-x-1 group-hover:border-white group-hover:bg-white group-hover:text-primary">
          <ArrowUpRight className="size-5" />
        </span>
      </Reveal>
    </Link>
  );
}

interface BrandCategoriesSectionProps {
  brands: PublicBrand[];
  setting: PublicSiteSetting | null;
}

export async function BrandCategoriesSection({
  brands,
  setting,
}: BrandCategoriesSectionProps) {
  const t = await getTranslations("home");
  const tiles = buildTiles(brands, setting);

  if (tiles.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="brand-categories-title"
      className="site-container-wide grid gap-8 py-10 md:gap-10 md:py-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2
          id="brand-categories-title"
          className="text-3xl leading-[1.1] font-semibold tracking-tight text-balance md:text-5xl"
        >
          {t("categoriesTitle")}
        </h2>
        <Link
          href="/brands"
          className="group inline-flex items-center gap-2 text-[15px] font-medium text-primary"
        >
          {t("allBrands")}
          <ArrowRight className="size-4 transition-[translate] duration-200 ease-(--ease-out) group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className={GRID_CLASSES[tiles.length]}>
        {tiles.map((tile, index) => (
          <CategoryCard
            key={tile.category}
            tile={tile}
            index={index}
            isFeatured={tiles.length === 3 && index === 0}
            heightClass={TILE_HEIGHT_CLASSES[tiles.length]}
          />
        ))}
      </div>
    </section>
  );
}
