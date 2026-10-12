import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { PublicBrandDetail } from "@/lib/public-api";

interface BrandHeroProps {
  brand: PublicBrandDetail;
  countryName: string | null;
}

export async function BrandHero({ brand, countryName }: BrandHeroProps) {
  const t = await getTranslations();
  const categoryNames = brand.categories
    .map((category) => t(`categories.${category}`))
    .join(", ");
  const meta = [countryName, categoryNames].filter(Boolean).join(" · ");

  return (
    <section
      aria-labelledby="brand-title"
      className="overflow-hidden rounded-3xl bg-card md:rounded-[2rem]"
    >
      <div className="relative h-56 sm:h-80 lg:h-[28rem]">
        {brand.coverUrl ? (
          <Image
            src={brand.coverUrl}
            alt=""
            fill
            unoptimized
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="bg-brand-gradient absolute inset-0" />
        )}
      </div>

      <div className="grid gap-6 px-5 pb-8 sm:px-8 md:pb-12 lg:grid-cols-[auto_1fr_auto] lg:items-end lg:gap-8 lg:px-12">
        <div className="relative -mt-14 size-28 shrink-0 overflow-hidden rounded-3xl bg-card shadow-[0_8px_30px_oklch(0.34_0.15_268/0.12)] ring-1 ring-foreground/5 md:-mt-20 md:size-40 md:rounded-[2rem]">
          {brand.logoUrl ? (
            <Image
              src={brand.logoUrl}
              alt={brand.name}
              fill
              unoptimized
              sizes="160px"
              className="object-contain p-4 md:p-6"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-2xl font-semibold">
              {brand.name.charAt(0)}
            </span>
          )}
        </div>

        <div className="grid gap-2">
          <h1
            id="brand-title"
            className="text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl"
          >
            {brand.name}
          </h1>
          {meta && <p className="text-muted-foreground md:text-lg">{meta}</p>}
        </div>

        {brand.websiteUrl && (
          <a
            href={brand.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-primary px-6 text-[15px] font-medium text-primary-foreground transition-[background-color,scale] duration-150 ease-(--ease-out) hover:bg-primary/90 motion-safe:active:scale-[0.97]"
          >
            {t("brands.website")}
            <ArrowUpRight className="size-4" />
          </a>
        )}

        {brand.summary && (
          <p className="max-w-3xl text-lg leading-relaxed text-foreground/80 lg:col-span-3">
            {brand.summary}
          </p>
        )}
      </div>
    </section>
  );
}
