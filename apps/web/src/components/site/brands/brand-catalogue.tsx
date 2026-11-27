import { BRAND_CATEGORIES } from "@cosmo/shared";
import { getTranslations } from "next-intl/server";
import type { PublicBrand } from "@/lib/public-api";
import { BrandFilter, type BrandFilterOption } from "./brand-filter";
import { BrandLogoCard } from "./brand-logo-card";

export const BRAND_LIST_ID = "brand-list";

interface BrandCatalogueProps {
  brands: PublicBrand[];
}

export async function BrandCatalogue({ brands }: BrandCatalogueProps) {
  const t = await getTranslations("brands");

  const categoryOptions = BRAND_CATEGORIES.flatMap((category) => {
    const count = brands.filter((brand) =>
      brand.categories.includes(category),
    ).length;

    if (count === 0) {
      return [];
    }

    return [
      {
        key: category,
        label: t(`chapters.${category}.label`),
        count,
        resultLabel: t("filter.result", { count }),
      },
    ];
  });

  const options: BrandFilterOption[] = [
    {
      key: "ALL",
      label: t("filter.all"),
      count: brands.length,
      resultLabel: t("filter.result", { count: brands.length }),
    },
    ...categoryOptions,
  ];

  return (
    <section
      id={BRAND_LIST_ID}
      aria-labelledby="brand-list-title"
      data-flush-footer
      className="site-container scroll-mt-20 pt-10 pb-20 md:pt-14 md:pb-32 lg:scroll-mt-24"
    >
      <h2 id="brand-list-title" className="sr-only">
        {t("listTitle")}
      </h2>

      {brands.length === 0 ? (
        <p className="text-lg text-ink-2">{t("empty")}</p>
      ) : (
        <BrandFilter
          label={t("filter.label")}
          options={options}
          items={brands.map((brand) => ({
            slug: brand.slug,
            categories: brand.categories,
            card: <BrandLogoCard brand={brand} />,
          }))}
        />
      )}
    </section>
  );
}
