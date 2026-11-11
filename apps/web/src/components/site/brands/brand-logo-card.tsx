import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { PublicBrand } from "@/lib/public-api";
import { brandPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";
import { BRAND_TILE_BACKGROUND } from "./brand-tile-background";

interface BrandLogoCardProps {
  brand: PublicBrand;
}

interface ShowcaseVisualProps {
  brand: PublicBrand;
  imageUrl: string;
}

function ShowcaseVisual({ brand, imageUrl }: ShowcaseVisualProps) {
  return (
    <>
      <Image
        src={imageUrl}
        alt={brand.name}
        fill
        unoptimized
        sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
        className="object-contain px-[16%] pt-[8%] pb-[14%] transition-[scale] duration-500 ease-(--ease-out) group-hover:scale-[1.05] motion-reduce:transition-none"
      />
      {brand.logoUrl && (
        <span className="absolute bottom-3 left-3 size-11 overflow-hidden rounded-full bg-white shadow-[0_4px_16px_color-mix(in_srgb,var(--color-brand-900)_14%,transparent)] md:size-13">
          <Image
            src={brand.logoUrl}
            alt=""
            fill
            unoptimized
            sizes="52px"
            className="object-contain p-2"
          />
        </span>
      )}
    </>
  );
}

export function BrandLogoCard({ brand }: BrandLogoCardProps) {
  return (
    <Link
      href={brandPath(brand.slug)}
      className="group flex h-full flex-col gap-3.5 rounded-card outline-offset-4 outline-brand focus-visible:outline-2"
    >
      <span
        className={cn(
          "relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-card transition-[translate] duration-400 ease-(--ease-out) group-hover:-translate-y-1 motion-reduce:transition-none",
          BRAND_TILE_BACKGROUND,
        )}
      >
        {brand.showcaseImageUrl ? (
          <ShowcaseVisual brand={brand} imageUrl={brand.showcaseImageUrl} />
        ) : (
          <BrandLogo
            brand={brand}
            baseWidth={30}
            nameClassName="text-xl transition-[scale] duration-500 ease-(--ease-out) group-hover:scale-[1.05] motion-reduce:transition-none md:text-[22px]"
          />
        )}
      </span>

      <span className="grid gap-1.5">
        <h3 className="type-h4 font-semibold text-ink transition-colors duration-150 group-hover:text-brand-700">
          {brand.name}
        </h3>
        {brand.productTypes && (
          <span className="text-sm leading-normal text-ink-2">
            {brand.productTypes}
          </span>
        )}
      </span>
    </Link>
  );
}
