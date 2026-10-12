import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { BrandCard } from "@/components/site/brands/brand-card";
import { BrandHero } from "@/components/site/brands/brand-hero";
import { ProductGrid } from "@/components/site/brands/product-grid";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import { StorySections } from "@/components/site/story-sections";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { fetchBrand, fetchBrands } from "@/lib/public-api";

const MAX_RELATED = 4;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/brands/[slug]">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const { slug } = await params;
  const brand = await fetchBrand(slug, locale);

  if (!brand) {
    return {};
  }

  return {
    title: brand.name,
    description: brand.summary ?? undefined,
  };
}

export default async function BrandPage({
  params,
}: PageProps<"/[locale]/brands/[slug]">) {
  const locale = await getPageLocale(params);
  const { slug } = await params;
  const t = await getTranslations();
  const [brand, allBrands] = await Promise.all([
    fetchBrand(slug, locale),
    fetchBrands(locale),
  ]);

  if (!brand) {
    notFound();
  }

  const countryNames = new Intl.DisplayNames([locale], { type: "region" });
  const countryNameOf = (code: string | null) =>
    code ? (countryNames.of(code) ?? null) : null;

  const mainCategory = brand.categories[0];
  const relatedBrands = allBrands
    .filter(
      (other) =>
        other.slug !== brand.slug &&
        other.categories.some((category) =>
          brand.categories.includes(category),
        ),
    )
    .slice(0, MAX_RELATED);

  return (
    <div className="site-container-wide grid gap-4 pt-4 md:gap-6 md:pt-6">
      <Link
        href="/brands"
        className="group inline-flex w-fit items-center gap-2 rounded-full px-1 py-1 text-[15px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft className="size-4 transition-[translate] duration-200 ease-(--ease-out) group-hover:-translate-x-0.5" />
        {t("nav.brands")}
      </Link>

      <BrandHero
        brand={brand}
        countryName={countryNameOf(brand.originCountry)}
      />

      {brand.products.length > 0 && (
        <section
          aria-labelledby="brand-products-title"
          className="grid gap-8 pt-12 md:gap-10 md:pt-20"
        >
          <SectionHeader
            id="brand-products-title"
            title={t("brands.products")}
          />
          <ProductGrid products={brand.products} />
        </section>
      )}

      {brand.sections.length > 0 && (
        <div className="pt-8 md:pt-14">
          <StorySections sections={brand.sections} />
        </div>
      )}

      {relatedBrands.length > 0 && (
        <section
          aria-labelledby="related-brands-title"
          className="grid gap-8 pt-12 md:gap-10 md:pt-20"
        >
          <SectionHeader
            id="related-brands-title"
            title={t("brands.related")}
            link={{
              href: `/brands?category=${mainCategory}`,
              label: t("home.allBrands"),
            }}
          />
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
            {relatedBrands.map((other, index) => (
              <li key={other.slug}>
                <Reveal index={index}>
                  <BrandCard
                    brand={other}
                    countryName={countryNameOf(other.originCountry)}
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
