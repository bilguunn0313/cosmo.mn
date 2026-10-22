import { BRAND_CATEGORIES, type BrandCategory } from "@cosmo/shared";
import { ArrowDown } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BrandTile } from "@/components/site/brands/brand-tile";
import { CatalogBook } from "@/components/site/brands/catalog-book";
import { CategoryFilter } from "@/components/site/brands/category-filter";
import { PageBanner } from "@/components/site/page-banner";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { CATALOG } from "@/lib/catalog";
import { pageBannerUrl } from "@/lib/page-banners";
import { fetchBrands, fetchSiteSetting } from "@/lib/public-api";
import type { PublicBrand } from "@/lib/public-api";
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
  const [brands, setting] = await Promise.all([
    fetchBrands(locale),
    fetchSiteSetting(locale),
  ]);

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
  const brandMeta = (brand: PublicBrand) =>
    [
      brand.categories.map((category) => t(`categories.${category}`)).join(", "),
      brand.originCountry ? countryNames.of(brand.originCountry) : null,
    ]
      .filter(Boolean)
      .join(" · ");
  const hasCatalog = CATALOG.pages.length > 0;

  return (
    <>
      <PageBanner
        title={t("nav.brands")}
        imageUrl={pageBannerUrl(setting, "brands")}
      >
        {hasCatalog && (
          <a
            href="#catalog"
            className={siteButtonClass("white", "min-w-52.5")}
          >
            {t("catalog.view")}
            <ArrowDown className="size-4.5" />
          </a>
        )}
      </PageBanner>

      <div className="site-container grid gap-6 pt-8 md:gap-8 md:pt-12">
        <CategoryFilter
          options={filterOptions}
          activeCategory={activeCategory}
        />

        {shownBrands.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 md:gap-y-10 xl:grid-cols-4">
            {shownBrands.map((brand, index) => (
              <li key={brand.slug}>
                <Reveal index={index % REVEAL_COLUMNS} className="h-full">
                  <BrandTile brand={brand} meta={brandMeta(brand)} />
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid justify-items-start gap-5 py-20">
            <p className="type-h3">{t("brands.empty")}</p>
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
            <h2 id="catalog-title" className="type-h2">
              {t("catalog.title")}
            </h2>
            <p className="text-sm text-ink-2">{t("catalog.hint")}</p>
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
    </>
  );
}
