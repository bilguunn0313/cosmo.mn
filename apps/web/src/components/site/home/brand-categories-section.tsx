import { BRAND_CATEGORIES } from "@cosmo/shared";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/site/section-header";
import type { PublicBrand, PublicSiteSetting } from "@/lib/public-api";
import { BrandShowcase, type CategoryTile } from "./brand-showcase";

function buildTiles(
  brands: PublicBrand[],
  setting: PublicSiteSetting | null,
): CategoryTile[] {
  return BRAND_CATEGORIES.flatMap((category) => {
    const inCategory = brands.filter((brand) =>
      brand.categories.includes(category),
    );

    if (inCategory.length === 0) {
      return [];
    }

    return {
      category,
      imageUrl:
        setting?.categoryImages?.[category] ??
        inCategory.find((brand) => brand.coverUrl)?.coverUrl ??
        null,
    };
  });
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

  if (brands.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="brand-categories-title"
      className="pt-20 md:pt-28"
    >
      <div className="site-container">
        <SectionHeader
          id="brand-categories-title"
          title={t("categoriesTitle")}
          link={{ href: "/brands", label: t("allBrands") }}
        />
      </div>

      <BrandShowcase brands={brands} tiles={buildTiles(brands, setting)} />
    </section>
  );
}
