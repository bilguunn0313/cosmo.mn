import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AboutIntroSection } from "@/components/site/home/about-intro-section";
import { BrandCategoriesSection } from "@/components/site/home/brand-categories-section";
import { BrandMarquee } from "@/components/site/home/brand-marquee";
import { HeroCarousel } from "@/components/site/home/hero-carousel";
import { HeroFallback } from "@/components/site/home/hero-fallback";
import { HomeCtaSection } from "@/components/site/home/home-cta-section";
import { LatestNewsSection } from "@/components/site/home/latest-news-section";
import { ValuesSection } from "@/components/site/home/values-section";
import { WorldMapSection } from "@/components/site/home/world-map-section";
import { getPageLocale } from "@/i18n/locale";
import {
  fetchBrands,
  fetchLatestNews,
  fetchSiteSetting,
  fetchSlides,
} from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";

const HOME_NEWS_COUNT = 5;

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
  const t = await getTranslations();
  const [slides, brands, setting, news] = await Promise.all([
    fetchSlides(locale),
    fetchBrands(locale),
    fetchSiteSetting(locale),
    fetchLatestNews(locale, HOME_NEWS_COUNT),
  ]);

  return (
    <>
      <h1 className="sr-only">{t("seo.homeTitle")}</h1>
      {slides.length > 0 ? <HeroCarousel slides={slides} /> : <HeroFallback />}
      <AboutIntroSection setting={setting} brands={brands} />
      <WorldMapSection brands={brands} locale={locale} />
      <BrandMarquee brands={brands} />
      <BrandCategoriesSection brands={brands} setting={setting} />
      <ValuesSection />
      <LatestNewsSection news={news} />
      <HomeCtaSection setting={setting} />
    </>
  );
}
