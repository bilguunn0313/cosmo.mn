import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { PAGE_BANNER_ID } from "@/components/site/site-nav";
import type { PublicSlide } from "@/lib/public-api";
import { HeroCarousel } from "./hero-carousel";

const HERO_PLACEHOLDER = "/images/home/hero-building.webp";

interface HomeHeroProps {
  slides: PublicSlide[];
}

export async function HomeHero({ slides }: HomeHeroProps) {
  const t = await getTranslations("home");

  return (
    <section
      id={PAGE_BANNER_ID}
      aria-labelledby="hero-title"
      className="relative isolate h-160 overflow-hidden bg-brand-700 text-white md:h-180 lg:h-[clamp(40rem,calc(100svh-4.5rem),60rem)]"
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
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-night/86 via-brand-night/60 via-40% to-brand-night/0 to-72% lg:from-brand-night/82 lg:via-brand-night/50 lg:via-34% lg:to-60%"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-linear-to-r from-brand-night/45 to-brand-night/0 to-50% lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-50 bg-linear-to-b from-brand-700/85 from-30% via-brand-700/40 via-60% to-brand-700/0"
      />

      <div className="site-container pointer-events-none relative flex h-full flex-col justify-end pb-20 lg:pb-24">
        <h1 id="hero-title" className="type-tagline">
          {t.rich("heroTitle", {
            line: (chunks) => (
              <span className="tagline-line">
                <span>{chunks}</span>
              </span>
            ),
            accent: (chunks) => (
              <em className="text-brand-300 not-italic">{chunks}</em>
            ),
          })}
        </h1>
      </div>
    </section>
  );
}
