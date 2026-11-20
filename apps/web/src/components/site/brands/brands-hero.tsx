import { getTranslations } from "next-intl/server";
import { LogoMark } from "@/components/site/logo-mark";
import { PAGE_BANNER_ID } from "@/components/site/site-nav";
import type { PublicBrand } from "@/lib/public-api";
import { type BrandSlide, BrandsHeroCarousel } from "./brands-hero-carousel";

const DEFAULT_RATIO = 16 / 9;

function brandSlides(brands: PublicBrand[]): BrandSlide[] {
  return brands.flatMap((brand) => {
    if (!brand.coverUrl) {
      return [];
    }

    const ratio =
      brand.coverWidth && brand.coverHeight
        ? brand.coverWidth / brand.coverHeight
        : DEFAULT_RATIO;

    return [
      {
        slug: brand.slug,
        name: brand.name,
        imageUrl: brand.coverUrl,
        ratio,
      },
    ];
  });
}

interface BrandsHeroProps {
  brands: PublicBrand[];
  children?: React.ReactNode;
}

export async function BrandsHero({ brands, children }: BrandsHeroProps) {
  const t = await getTranslations();
  const slides = brandSlides(brands);

  const intro = (
    <div className="grid justify-items-start gap-4.5">
      <h1
        id="brands-title"
        className="hero-rise type-hero text-balance [--rise-delay:100ms]"
      >
        {t("nav.brands")}
      </h1>
      <p className="hero-rise text-lg/relaxed text-pretty text-brand-200 [--rise-delay:240ms] md:text-[19px]">
        {t("brands.description")}
      </p>
      {children && (
        <div className="hero-rise pointer-events-auto mt-3 flex flex-col items-start gap-5 [--rise-delay:380ms]">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <section
      id={PAGE_BANNER_ID}
      aria-labelledby="brands-title"
      className="relative isolate overflow-hidden bg-brand-700 text-white"
    >
      {slides.length > 0 ? (
        <BrandsHeroCarousel slides={slides}>{intro}</BrandsHeroCarousel>
      ) : (
        <>
          <LogoMark className="absolute -bottom-65 -left-45 -z-10 w-170 text-white/5" />
          <div className="site-container pt-32 pb-20 md:pt-44 md:pb-28">
            {intro}
          </div>
        </>
      )}
    </section>
  );
}
