import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { siteButtonClass } from "@/components/site/site-button";
import { PAGE_BANNER_ID } from "@/components/site/site-nav";
import { Link } from "@/i18n/navigation";
import type { HomeStats } from "@/lib/home-stats";
import type { PublicSlide } from "@/lib/public-api";
import { HeroCarousel } from "./hero-carousel";

const HERO_PLACEHOLDER = "/images/home/hero-building.webp";

interface HomeHeroProps {
  slides: PublicSlide[];
  stats: HomeStats;
}

export async function HomeHero({ slides, stats }: HomeHeroProps) {
  const t = await getTranslations();
  const text =
    stats.foundedYear && stats.salesPoints
      ? t("home.heroText", {
          foundedYear: stats.foundedYear,
          salesPoints: stats.salesPoints,
        })
      : t("home.heroTextPlain");

  return (
    <section
      id={PAGE_BANNER_ID}
      aria-labelledby="hero-title"
      className="relative isolate h-160 overflow-hidden bg-brand-700 text-white md:h-180"
    >
      {slides.length > 0 ? (
        <HeroCarousel slides={slides} />
      ) : (
        <Image
          src={HERO_PLACEHOLDER}
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-700/92 via-brand/78 via-55% to-brand/40 lg:bg-linear-to-r lg:from-brand-700/94 lg:via-brand/72 lg:via-40% lg:to-brand/0 lg:to-74%"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-50 bg-linear-to-b from-brand-700/85 from-30% via-brand-700/40 via-60% to-brand-700/0"
      />

      <div className="site-container pointer-events-none relative flex h-full flex-col justify-end gap-6 pt-21 pb-28 lg:justify-center lg:pb-14">
        <h1
          id="hero-title"
          className="hero-rise max-w-165 type-hero text-balance [--rise-delay:100ms]"
        >
          {t("home.heroTitle")}
        </h1>
        <p className="hero-rise max-w-130 text-lg/relaxed text-pretty text-white/88 [--rise-delay:240ms] md:text-[19px]">
          {text}
        </p>
        <div className="hero-rise [--rise-delay:380ms]">
          <Link
            href="/about"
            className={siteButtonClass(
              "white",
              "pointer-events-auto px-7 text-base font-medium",
            )}
          >
            {t("nav.about")}
          </Link>
        </div>
      </div>
    </section>
  );
}
