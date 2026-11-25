import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BrandCatalogue } from "@/components/site/brands/brand-catalogue";
import { BrandsHero } from "@/components/site/brands/brands-hero";
import { CatalogBook } from "@/components/site/brands/catalog-book";
import { Reveal } from "@/components/site/reveal";
import { getPageLocale } from "@/i18n/locale";
import { CATALOG } from "@/lib/catalog";
import { fetchBrands } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";

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
}: PageProps<"/[locale]/brands">) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();
  const brands = await fetchBrands(locale);
  const hasCatalog = CATALOG.pages.length > 0;

  return (
    <>
      <BrandsHero brands={brands} />

      <BrandCatalogue brands={brands} />

      {hasCatalog && (
        <section
          id="catalog"
          aria-labelledby="catalog-title"
          className="site-container scroll-mt-28 py-20 md:py-30"
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
