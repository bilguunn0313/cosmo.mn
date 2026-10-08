import { getTranslations } from "next-intl/server";
import { HeroCarousel } from "@/components/site/home/hero-carousel";
import { HeroFallback } from "@/components/site/home/hero-fallback";
import { getPageLocale } from "@/i18n/locale";
import { fetchSlides } from "@/lib/public-api";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await getPageLocale(params);
  const t = await getTranslations("metadata");
  const slides = await fetchSlides(locale);

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
    </>
  );
}
