import { getTranslations } from "next-intl/server";
import { BrandCategoriesSection } from "@/components/site/home/brand-categories-section";
import { BrandMarquee } from "@/components/site/home/brand-marquee";
import { HeroCarousel } from "@/components/site/home/hero-carousel";
import { HeroFallback } from "@/components/site/home/hero-fallback";
import { LatestNewsSection } from "@/components/site/home/latest-news-section";
import { StatsSection } from "@/components/site/home/stats-section";
import { WorldMapSection } from "@/components/site/home/world-map-section";
import { getPageLocale } from "@/i18n/locale";
import {
  fetchBrands,
  fetchLatestNews,
  fetchSiteSetting,
  fetchSlides,
} from "@/lib/public-api";

const HOME_NEWS_COUNT = 4;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await getPageLocale(params);
  const t = await getTranslations("metadata");
  const [slides, brands, setting, news] = await Promise.all([
    fetchSlides(locale),
    fetchBrands(locale),
    fetchSiteSetting(locale),
    fetchLatestNews(locale, HOME_NEWS_COUNT),
  ]);

  return (
    <>
      <h1 className="sr-only">
        {t("title")}. {t("description")}
      </h1>
      <div className="site-container-wide pt-2">
        {slides.length > 0 ? (
          <HeroCarousel slides={slides} />
        ) : (
          <HeroFallback />
        )}
      </div>
      <BrandMarquee brands={brands} />
      <StatsSection setting={setting} brands={brands} />
      <WorldMapSection brands={brands} locale={locale} />
      <BrandCategoriesSection brands={brands} setting={setting} />
      <LatestNewsSection news={news} />
    </>
  );
}
