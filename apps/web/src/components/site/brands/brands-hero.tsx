import { getTranslations } from "next-intl/server";
import type { PublicBrand } from "@/lib/public-api";
import { type BrandSlide, BrandsStrip } from "./brands-strip";

const DEFAULT_RATIO = 16 / 9;

function productTypeText(brandName: string, productTypes: string | null) {
  const text = productTypes?.trim();

  if (!text) {
    return null;
  }

  const startsWithName = text.toLowerCase().startsWith(brandName.toLowerCase());

  if (!startsWithName) {
    return text;
  }

  return text.slice(brandName.length).replace(/^\s*[—–-]\s*/, "") || null;
}

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
        productType: productTypeText(brand.name, brand.productTypes),
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

  return (
    <section aria-labelledby="brands-title" className="pt-8 md:pt-14">
      <div className="site-container flex flex-col items-center gap-3 text-center md:gap-4">
        <h1 id="brands-title" className="type-section text-balance text-ink">
          {t("nav.brands")}
        </h1>
        <p className="text-lg text-ink-2">{t("brands.description")}</p>
      </div>
      {slides.length > 0 && <BrandsStrip slides={slides} />}
    </section>
  );
}
