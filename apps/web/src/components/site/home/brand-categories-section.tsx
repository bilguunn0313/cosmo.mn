import { BRAND_CATEGORIES, type BrandCategory } from "@cosmo/shared";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ImageReveal } from "@/components/site/image-reveal";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import { Link } from "@/i18n/navigation";
import type { PublicBrand, PublicSiteSetting } from "@/lib/public-api";

const TILE_STAGGER_SECONDS = 0.07;

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
}

async function CategoryCard({ tile, index }: CategoryCardProps) {
  const t = await getTranslations("categories");
  const delay = index * TILE_STAGGER_SECONDS;

  return (
    <Link
      href={{ pathname: "/brands", query: { category: tile.category } }}
      className="group flex flex-col outline-offset-4 outline-brand focus-visible:outline-2"
    >
      <div className="relative h-[clamp(320px,35vw,500px)] overflow-hidden bg-surface">
        <ImageReveal delay={delay}>
          {tile.imageUrl ? (
            <Image
              src={tile.imageUrl}
              alt=""
              fill
              unoptimized
              loading="eager"
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-[scale] duration-800 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          ) : (
            <div className="absolute inset-0 bg-brand" />
          )}
        </ImageReveal>
      </div>

      <Reveal
        delay={delay}
        className="flex items-center justify-between gap-4 border-b-2 border-rule py-5"
      >
        <span className="flex items-baseline gap-4">
          <span className="text-sm font-semibold text-brand tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[clamp(26px,2.4vw,34px)] leading-tight font-semibold tracking-heading transition-colors duration-150 group-hover:text-brand-700">
            {t(tile.category)}
          </span>
        </span>
        <ArrowUpRight className="size-6 shrink-0 transition-[translate,color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-700" />
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
      className="site-container pt-20 md:pt-28"
    >
      <SectionHeader
        id="brand-categories-title"
        title={t("categoriesTitle")}
        link={{ href: "/brands", label: t("allBrands") }}
      />

      <div className="mt-6 grid gap-x-6 gap-y-10 md:grid-cols-3">
        {tiles.map((tile, index) => (
          <CategoryCard key={tile.category} tile={tile} index={index} />
        ))}
      </div>
    </section>
  );
}
