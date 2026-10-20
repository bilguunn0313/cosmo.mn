import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/site/section-header";
import type { PublicBrand } from "@/lib/public-api";
import { BrandBento } from "./brand-bento";

function pickBentoBrands(brands: PublicBrand[]) {
  const featured = brands
    .filter((brand) => brand.featuredOrder !== null)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));

  return featured.length > 0 ? featured : brands;
}

interface BrandCategoriesSectionProps {
  brands: PublicBrand[];
}

export async function BrandCategoriesSection({
  brands,
}: BrandCategoriesSectionProps) {
  const t = await getTranslations("home");

  if (brands.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="brand-categories-title"
      className="site-container pt-20 md:pt-32"
    >
      <SectionHeader
        id="brand-categories-title"
        title={t("categoriesTitle")}
        link={{ href: "/brands", label: t("allBrands") }}
      />
      <BrandBento brands={pickBentoBrands(brands)} />
    </section>
  );
}
