import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BusinessAreasSection } from "@/components/site/home/business-areas-section";
import { HomeHero } from "@/components/site/home/home-hero";
import { LatestNewsSection } from "@/components/site/home/latest-news-section";
import { RetailChannelsSection } from "@/components/site/home/retail-channels-section";
import { RetailPartnersSection } from "@/components/site/home/retail-partners-section";
import { StatsSection } from "@/components/site/home/stats-section";
import { WhyCosmoSection } from "@/components/site/home/why-cosmo-section";
import { WorldMapSection } from "@/components/site/home/world-map-section";
import { getPageLocale } from "@/i18n/locale";
import {
  fetchLatestNews,
  fetchOriginCountries,
  fetchRetailPartners,
  fetchSections,
  fetchSiteSetting,
  fetchSlides,
} from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";

const HOME_NEWS_COUNT = 4;

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
  const [slides, areas, setting, countries, partners, news] = await Promise.all(
    [
      fetchSlides(locale),
      fetchSections("home", locale),
      fetchSiteSetting(locale),
      fetchOriginCountries(locale),
      fetchRetailPartners(locale),
      fetchLatestNews(locale, HOME_NEWS_COUNT),
    ],
  );

  return (
    <>
      <HomeHero slides={slides} />
      <StatsSection setting={setting} />
      <BusinessAreasSection sections={areas} />
      <WhyCosmoSection />
      <WorldMapSection countries={countries} locale={locale} />
      <RetailPartnersSection partners={partners} />
      <RetailChannelsSection />
      <LatestNewsSection news={news} />
    </>
  );
}
