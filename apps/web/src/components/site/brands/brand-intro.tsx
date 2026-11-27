import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import type { PublicBrandDetail, PublicBrandImage } from "@/lib/public-api";
import { cn } from "@/lib/utils";
import { BrandGallery } from "./brand-gallery";
import { BrandLogo } from "./brand-logo";
import { BRAND_TILE_BACKGROUND } from "./brand-tile-background";

const DEFAULT_COVER_RATIO = 5 / 4;
const MIN_COVER_RATIO = 4 / 5;
const MAX_COVER_RATIO = 2;

function coverRatio(width: number | null, height: number | null) {
  if (!width || !height) {
    return DEFAULT_COVER_RATIO;
  }

  return Math.min(MAX_COVER_RATIO, Math.max(MIN_COVER_RATIO, width / height));
}

function galleryImages(brand: PublicBrandDetail): PublicBrandImage[] {
  const cover = brand.coverUrl
    ? [
        {
          url: brand.coverUrl,
          width: brand.coverWidth,
          height: brand.coverHeight,
        },
      ]
    : [];

  return [...cover, ...brand.images];
}

interface BrandIntroProps {
  brand: PublicBrandDetail;
}

export async function BrandIntro({ brand }: BrandIntroProps) {
  const t = await getTranslations();
  const categoryNames = brand.categories
    .map((category) => t(`brands.chapters.${category}.label`))
    .join(", ");
  const images = galleryImages(brand);
  const firstImage = images[0];

  return (
    <section
      aria-labelledby="brand-title"
      className="pt-8 pb-20 md:pt-10 md:pb-26"
    >
      <div className="site-container grid items-center gap-10 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <div className="grid justify-items-start gap-4.5">
          <SectionEyebrow className="hero-rise [--rise-delay:100ms]">
            {categoryNames}
          </SectionEyebrow>
          <h1
            id="brand-title"
            className="hero-rise type-hero wrap-anywhere text-ink [--rise-delay:200ms]"
          >
            {brand.name}
          </h1>
          {brand.summary && (
            <p className="hero-rise max-w-[56ch] text-lg leading-[1.7] text-pretty whitespace-pre-line text-ink-2 [--rise-delay:320ms]">
              {brand.summary}
            </p>
          )}
        </div>

        <Reveal from="zoom">
          {firstImage ? (
            <BrandGallery
              imageUrls={images.map((image) => image.url)}
              alt={t("brands.coverAlt", { name: brand.name })}
              ratio={coverRatio(firstImage.width, firstImage.height)}
            />
          ) : (
            <div
              className={cn(
                "flex aspect-5/4 items-center justify-center rounded-[28px]",
                BRAND_TILE_BACKGROUND,
              )}
            >
              <BrandLogo
                brand={brand}
                baseWidth={34}
                nameClassName="text-3xl md:text-4xl"
              />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
