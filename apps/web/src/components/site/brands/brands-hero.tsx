import { getTranslations } from "next-intl/server";
import type { PublicBrand } from "@/lib/public-api";
import { type BrandSlide, BrandsStrip } from "./brands-strip";

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
}

export async function BrandsHero({ brands }: BrandsHeroProps) {
  const t = await getTranslations();
  const slides = brandSlides(brands);

  if (slides.length === 0) {
    return (
      <section
        aria-labelledby="brands-title"
        className="site-container grid gap-4 pt-8 md:pt-14"
      >
        <h1 id="brands-title" className="type-section text-balance text-ink">
          {t("nav.brands")}
        </h1>
        <p className="text-lg text-ink-2">{t("brands.description")}</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="brands-title">
      <h1 id="brands-title" className="sr-only">
        {t("nav.brands")}
      </h1>
      <BrandsStrip slides={slides} />
    </section>
  );
}
