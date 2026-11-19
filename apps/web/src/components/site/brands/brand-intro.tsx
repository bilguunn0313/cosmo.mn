import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import type { PublicBrandDetail } from "@/lib/public-api";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";
import { BRAND_TILE_BACKGROUND } from "./brand-tile-background";

interface BrandIntroProps {
  brand: PublicBrandDetail;
}

export async function BrandIntro({ brand }: BrandIntroProps) {
  const t = await getTranslations();
  const categoryNames = brand.categories
    .map((category) => t(`brands.chapters.${category}.label`))
    .join(", ");

  return (
    <section
      aria-labelledby="brand-title"
      className="pt-8 pb-20 md:pt-10 md:pb-26"
    >
      <div className="site-container grid items-center gap-10 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <div className="grid justify-items-start gap-4.5">
          <Breadcrumbs
            items={[
              { label: t("nav.home"), href: "/" },
              { label: t("nav.brands"), href: "/brands" },
              { label: brand.name },
            ]}
            className="hero-rise mb-3 [--rise-delay:0ms]"
          />

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
          {brand.coverUrl ? (
            <div className="relative aspect-5/4 overflow-hidden rounded-[28px] bg-surface">
              <Image
                src={brand.coverUrl}
                alt={t("brands.coverAlt", { name: brand.name })}
                fill
                priority
                unoptimized
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
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
