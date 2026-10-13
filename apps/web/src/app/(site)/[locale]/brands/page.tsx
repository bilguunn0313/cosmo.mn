import { BRAND_CATEGORIES, type BrandCategory } from "@cosmo/shared";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BrandCard } from "@/components/site/brands/brand-card";
import { CategoryFilter } from "@/components/site/brands/category-filter";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { fetchBrands } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";

const REVEAL_COLUMNS = 4;

function parseCategory(value: unknown): BrandCategory | null {
  return BRAND_CATEGORIES.find((category) => category === value) ?? null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/brands">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale });

  return pageMetadata({
    locale,
    path: "/brands",
    title: t("seo.brandsTitle"),
    description: t("seo.brandsDescription"),
  });
}

export default async function BrandsPage({
  params,
  searchParams,
}: PageProps<"/[locale]/brands">) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();
  const activeCategory = parseCategory((await searchParams).category);
  const brands = await fetchBrands(locale);

  const inCategory = (category: BrandCategory) =>
    brands.filter((brand) => brand.categories.includes(category));

  const filterOptions = [
    { category: null, count: brands.length },
    ...BRAND_CATEGORIES.map((category) => ({
      category,
      count: inCategory(category).length,
    })).filter((option) => option.count > 0),
  ];

  const shownBrands = activeCategory ? inCategory(activeCategory) : brands;
  const countryNames = new Intl.DisplayNames([locale], { type: "region" });

  return (
    <div className="site-container-wide grid gap-8 pt-8 md:gap-10 md:pt-14">
      <div className="grid gap-4">
        <SectionHeader as="h1" id="brands-title" title={t("nav.brands")} />
        <p className="max-w-2xl text-lg text-muted-foreground">
          {t("brands.description")}
        </p>
      </div>

      <CategoryFilter options={filterOptions} activeCategory={activeCategory} />

      {shownBrands.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
          {shownBrands.map((brand, index) => (
            <li key={brand.slug}>
              <Reveal index={index % REVEAL_COLUMNS}>
                <BrandCard
                  brand={brand}
                  countryName={
                    brand.originCountry
                      ? (countryNames.of(brand.originCountry) ?? null)
                      : null
                  }
                />
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid justify-items-center gap-4 rounded-3xl bg-card px-6 py-20 text-center md:rounded-[2rem]">
          <p className="text-lg text-muted-foreground">{t("brands.empty")}</p>
          <Link
            href="/brands"
            className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-[15px] font-medium text-primary-foreground transition-[scale] duration-150 ease-(--ease-out) motion-safe:active:scale-[0.97]"
          >
            {t("brands.showAll")}
          </Link>
        </div>
      )}
    </div>
  );
}
