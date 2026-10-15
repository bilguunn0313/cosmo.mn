import { BRAND_CATEGORIES, type BrandCategory } from "@cosmo/shared";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BrandCard } from "@/components/site/brands/brand-card";
import { BrandsCover } from "@/components/site/brands/brands-cover";
import { CatalogBook } from "@/components/site/brands/catalog-book";
import { CategoryFilter } from "@/components/site/brands/category-filter";
import { GridFillers } from "@/components/site/grid-fillers";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { CONTACT_HREF } from "@/components/site/site-nav";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { CATALOG } from "@/lib/catalog";
import { fetchBrands } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";

const GRID_COLUMNS = { base: 2, md: 3, xl: 4 };

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

  const categories = BRAND_CATEGORIES.filter(
    (category) => inCategory(category).length > 0,
  );
  const filterOptions = [
    { category: null, count: brands.length },
    ...categories.map((category) => ({
      category,
      count: inCategory(category).length,
    })),
  ];

  const shownBrands = activeCategory ? inCategory(activeCategory) : brands;
  const countryNames = new Intl.DisplayNames([locale], { type: "region" });
  const hasCatalog = CATALOG.pages.length > 0;
  const coverUrl = brands.find((brand) => brand.coverUrl)?.coverUrl ?? null;

  return (
    <>
      <BrandsCover
        title={t("nav.brands")}
        countLabel={t("brands.count", {
          brands: brands.length,
          categories: categories.length,
        })}
        catalogLabel={hasCatalog ? t("catalog.view") : null}
        imageUrl={coverUrl}
      />

      <div className="site-container grid gap-6 pt-8 md:gap-8 md:pt-12">
        <CategoryFilter
          options={filterOptions}
          activeCategory={activeCategory}
        />

        {shownBrands.length > 0 ? (
          <ul className="grid grid-cols-2 gap-0.5 border-2 border-rule bg-rule md:grid-cols-3 xl:grid-cols-4">
            {shownBrands.map((brand, index) => (
              <li key={brand.slug} className="bg-paper">
                <Reveal index={index % GRID_COLUMNS.xl} className="h-full">
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
            <GridFillers
              itemCount={shownBrands.length}
              columns={GRID_COLUMNS}
            />
          </ul>
        ) : (
          <div className="grid justify-items-start gap-5 border-b-2 border-rule py-20">
            <p className="text-2xl font-semibold tracking-heading md:text-[32px]">
              {t("brands.empty")}
            </p>
            <Link href="/brands" className={siteButtonClass("secondary")}>
              {t("brands.showAll")}
            </Link>
          </div>
        )}
      </div>

      {hasCatalog && (
        <section
          id="catalog"
          aria-labelledby="catalog-title"
          className="site-container scroll-mt-28 pt-20 md:pt-32"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 pb-6 md:pb-8">
            <h2
              id="catalog-title"
              className="text-[clamp(40px,4.8vw,72px)] leading-[0.98] font-semibold tracking-heading"
            >
              {t("catalog.title")}
            </h2>
            <p className="text-[15px] text-ink-2">{t("catalog.hint")}</p>
          </div>
          <Reveal>
            <CatalogBook
              pages={CATALOG.pages}
              viewerUrl={CATALOG.viewerUrl}
              year={CATALOG.year}
              coverTitle={t("nav.brands")}
              labels={{
                catalog: t("catalog.title"),
                previous: t("catalog.previous"),
                next: t("catalog.next"),
                fullscreen: t("catalog.fullscreen"),
              }}
            />
          </Reveal>
        </section>
      )}

      <section
        aria-labelledby="brand-partner-title"
        className="site-container pt-20 md:pt-32"
      >
        <div className="grid gap-6 border-y-2 border-rule py-12 md:py-14 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <h2
            id="brand-partner-title"
            className="text-[clamp(36px,4.6vw,68px)] leading-none font-semibold tracking-heading text-balance lg:col-span-7"
          >
            {t("brands.partnerTitle")}
          </h2>
          <div className="grid justify-items-start gap-5 lg:col-span-5 lg:col-start-8">
            <p className="text-[17px] leading-normal text-pretty text-ink-2">
              {t("brands.partnerText")}
            </p>
            <Link
              href={CONTACT_HREF}
              className={siteButtonClass("primary", "w-full max-w-75")}
            >
              {t("brands.partnerButton")}
              <ArrowUpRight className="size-4.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
