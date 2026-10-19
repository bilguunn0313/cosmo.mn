import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { BrandHead } from "@/components/site/brands/brand-head";
import { BrandMiniCard } from "@/components/site/brands/brand-mini-card";
import { BrandProducts } from "@/components/site/brands/brand-products";
import { BrandWholesaleBand } from "@/components/site/brands/brand-wholesale-band";
import { GridFillers } from "@/components/site/grid-fillers";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { StorySections } from "@/components/site/story-sections";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { fetchBrand, fetchBrands } from "@/lib/public-api";
import type { PublicBrand } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";
import { brandPath } from "@/lib/site-links";

const MAX_RELATED = 4;

function pickRelatedBrands(current: PublicBrand, allBrands: PublicBrand[]) {
  const others = allBrands.filter((brand) => brand.slug !== current.slug);
  const sharesCategory = (brand: PublicBrand) =>
    brand.categories.some((category) => current.categories.includes(category));

  return [
    ...others.filter(sharesCategory),
    ...others.filter((brand) => !sharesCategory(brand)),
  ].slice(0, MAX_RELATED);
}

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
  const [brand, allBrands] = await Promise.all([
    fetchBrand(slug, locale),
    fetchBrands(locale),
  ]);

  if (!brand) {
    notFound();
  }

  const countryNames = new Intl.DisplayNames([locale], { type: "region" });
  const countryName = brand.originCountry
    ? (countryNames.of(brand.originCountry) ?? null)
    : null;
  const relatedBrands = pickRelatedBrands(brand, allBrands);

  return (
    <>
      <BrandHead brand={brand} countryName={countryName} />

      {brand.products.length > 0 && (
        <BrandProducts products={brand.products} summary={brand.summary} />
      )}

      {brand.sections.length > 0 && (
        <div className="site-container pt-20 md:pt-28">
          <StorySections sections={brand.sections} />
        </div>
      )}

      <BrandWholesaleBand brandName={brand.name} />

      {relatedBrands.length > 0 && (
        <section
          aria-labelledby="related-brands-title"
          className="site-container pt-20 md:pt-28"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 pb-5">
            <h2 id="related-brands-title" className="type-h2">
              {t("brands.related")}
            </h2>
            <Link href="/brands" className={siteButtonClass("ghost", "group")}>
              {t("home.allBrands")}
              <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-px border border-rule bg-rule xl:grid-cols-4">
            {relatedBrands.map((other, index) => (
              <li key={other.slug} className="bg-paper">
                <Reveal index={index} className="h-full">
                  <BrandMiniCard brand={other} />
                </Reveal>
              </li>
            ))}
            <GridFillers
              itemCount={relatedBrands.length}
              columns={{ base: 2, md: 2, xl: 4 }}
            />
          </ul>
        </section>
      )}
    </>
  );
}
