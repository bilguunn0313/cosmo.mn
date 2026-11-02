import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BrandMarquee } from "@/components/site/home/brand-marquee";
import { BusinessAreasSection } from "@/components/site/home/business-areas-section";
import { HomeHero } from "@/components/site/home/home-hero";
import { LatestNewsSection } from "@/components/site/home/latest-news-section";
import { PartnerCtaSection } from "@/components/site/home/partner-cta-section";
import { RetailPartnersSection } from "@/components/site/home/retail-partners-section";
import { WhyCosmoSection } from "@/components/site/home/why-cosmo-section";
import { WorldMapSection } from "@/components/site/home/world-map-section";
import { getPageLocale } from "@/i18n/locale";
import { homeStats } from "@/lib/home-stats";
import {
  fetchBrands,
  fetchLatestNews,
  fetchOriginCountries,
  fetchRetailPartners,
  fetchSiteSetting,
  fetchSlides,
} from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";

const HOME_NEWS_COUNT = 3;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale, namespace: "seo" });

  return pageMetadata({
    locale,
    path: "/",
    title: t("homeTitle"),
    description: t("homeDescription"),
    isHome: true,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await getPageLocale(params);
  const [slides, brands, setting, countries, partners, news] =
    await Promise.all([
      fetchSlides(locale),
      fetchBrands(locale),
      fetchSiteSetting(locale),
      fetchOriginCountries(locale),
      fetchRetailPartners(locale),
      fetchLatestNews(locale, HOME_NEWS_COUNT),
    ]);
  const stats = homeStats(setting, locale);

  return (
    <>
      <HomeHero slides={slides} stats={stats} />
      <BrandMarquee brands={brands} />
      <BusinessAreasSection />
      <WhyCosmoSection stats={stats} />
      <WorldMapSection countries={countries} locale={locale} />
      <RetailPartnersSection partners={partners} />
      <LatestNewsSection news={news} />
      <PartnerCtaSection />
    </>
  );
}
