import { BRAND_CATEGORIES } from "@cosmo/shared";
import { ArrowDown } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BrandChapter } from "@/components/site/brands/brand-chapter";
import { BrandMarquee } from "@/components/site/brands/brand-marquee";
import { BrandsHero } from "@/components/site/brands/brands-hero";
import { CatalogBook } from "@/components/site/brands/catalog-book";
import { PartnerCtaSection } from "@/components/site/home/partner-cta-section";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
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

  const chapters = BRAND_CATEGORIES.map((category) => ({
    category,
    brands: brands.filter((brand) => brand.categories.includes(category)),
  })).filter((chapter) => chapter.brands.length > 0);
  const hasCatalog = CATALOG.pages.length > 0;

  return (
    <>
      <BrandsHero brands={brands}>
        {hasCatalog && (
          <a href="#catalog" className={siteButtonClass("white", "min-w-52.5")}>
            {t("catalog.view")}
            <ArrowDown className="size-4.5" />
          </a>
        )}
      </BrandsHero>

      <BrandMarquee brands={brands} />

      {chapters.length === 0 && (
        <p className="site-container py-24 text-lg text-ink-2 md:py-32">
          {t("brands.empty")}
        </p>
      )}

      {chapters.map((chapter, index) => (
        <BrandChapter
          key={chapter.category}
          category={chapter.category}
          brands={chapter.brands}
          isAlternate={index % 2 === 1}
        />
      ))}

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

      <PartnerCtaSection
        title={t("brands.partnerTitle")}
        text={t("brands.partnerText")}
        isDark
      />
    </>
  );
}
