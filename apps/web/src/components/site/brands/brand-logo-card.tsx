import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { PublicBrand } from "@/lib/public-api";
import { brandPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";
import { BRAND_TILE_BACKGROUND } from "./brand-tile-background";

interface BrandLogoCardProps {
  brand: PublicBrand;
}

export function BrandLogoCard({ brand }: BrandLogoCardProps) {
  return (
    <Link
      href={brandPath(brand.slug)}
      className="group flex h-full flex-col gap-3 rounded-card outline-offset-6 outline-brand focus-visible:outline-2 md:gap-3.5"
    >
      <span
        className={cn(
          "relative grid aspect-4/3 place-items-center rounded-card transition-[translate,box-shadow,scale] duration-450 ease-(--ease-out) group-hover:-translate-y-1 group-hover:shadow-[0_22px_40px_-26px_rgb(19_54_89/0.45)] group-active:scale-[0.98] motion-reduce:transition-none",
          BRAND_TILE_BACKGROUND,
        )}
      >
        <BrandLogo
          brand={brand}
          baseWidth={34}
          maxWidth={66}
          nameClassName="text-lg md:text-xl"
          className="max-h-[48%] group-hover:scale-100"
        />
        <ArrowUpRight
          aria-hidden
          className="absolute top-3.5 right-3.5 size-4.5 text-brand-700 opacity-0 transition-[opacity,translate] duration-300 ease-(--ease-out) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 max-md:hidden"
        />
      </span>

      <h3 className="px-1 font-display text-base leading-snug font-medium text-ink transition-colors duration-200 group-hover:text-brand-700 md:text-lg">
        {brand.name}
      </h3>
    </Link>
  );
}
