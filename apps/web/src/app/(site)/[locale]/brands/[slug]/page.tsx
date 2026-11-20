import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { BrandIntro } from "@/components/site/brands/brand-intro";
import {
  ProductCard,
  ProductFeature,
} from "@/components/site/brands/product-card";
import { PartnerCtaSection } from "@/components/site/home/partner-cta-section";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { StorySections } from "@/components/site/story-sections";
import { getPageLocale } from "@/i18n/locale";
import { fetchBrand } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";
import { brandPath } from "@/lib/site-links";

const SHOW_BRAND_SECTIONS = false;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/brands/[slug]">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const { slug } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const brand = await fetchBrand(slug, locale);

  if (!brand) {
    return {};
  }

  return pageMetadata({
    locale,
    path: brandPath(brand.slug),
    title: t("brandTitle", { name: brand.name }),
    description: brand.summary ?? t("brandDescription", { name: brand.name }),
    image: brand.coverUrl ?? brand.logoUrl,
  });
}

export default async function BrandPage({
  params,
}: PageProps<"/[locale]/brands/[slug]">) {
  const locale = await getPageLocale(params);
  const { slug } = await params;
  const t = await getTranslations();
  const brand = await fetchBrand(slug, locale);

  if (!brand) {
    notFound();
  }

  return (
    <>
      <BrandIntro brand={brand} />

      {brand.products.length > 0 && (
        <section
          aria-labelledby="brand-products-title"
          className="pt-4 pb-18 md:pb-26"
        >
          <div className="site-container">
            <div className="flex flex-col gap-4">
              <Reveal>
                <SectionEyebrow>{brand.name}</SectionEyebrow>
              </Reveal>
              <Reveal index={1}>
                <h2 id="brand-products-title" className="type-section text-ink">
                  {t("brands.productsTitle")}
                </h2>
              </Reveal>
            </div>
            {brand.products.length === 1 ? (
              <Reveal index={2} className="mt-10 md:mt-12">
                <ProductFeature product={brand.products[0]} />
              </Reveal>
            ) : (
              <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-12 md:grid-cols-3 md:gap-x-5 md:gap-y-10 lg:grid-cols-4">
                {brand.products.map((product, index) => (
                  <li key={product.id}>
                    <Reveal index={index} className="h-full">
                      <ProductCard product={product} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {SHOW_BRAND_SECTIONS && brand.sections.length > 0 && (
        <div className="site-container pt-20 md:pt-32">
          <StorySections sections={brand.sections} />
        </div>
      )}

      <PartnerCtaSection
        title={t("brands.partnerTitle")}
        text={t("brands.partnerText")}
        isDark
      />
    </>
  );
}
