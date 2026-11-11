import Image from "next/image";
import type { PublicBrand } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const MAX_WIDTH_PERCENT = 66;

function logoWidth(brand: PublicBrand, baseWidth: number) {
  if (!brand.logoWidth || !brand.logoHeight) {
    return `${baseWidth}%`;
  }

  const ratio = brand.logoWidth / brand.logoHeight;
  const width = Math.min(
    MAX_WIDTH_PERCENT,
    Math.max(baseWidth * 0.7, baseWidth * Math.sqrt(ratio)),
  );

  return `${Math.round(width)}%`;
}

interface BrandLogoProps {
  brand: PublicBrand;
  baseWidth: number;
  nameClassName?: string;
}

export function BrandLogo({ brand, baseWidth, nameClassName }: BrandLogoProps) {
  if (!brand.logoUrl) {
    return (
      <span
        aria-hidden
        className={cn(
          "px-3 text-center font-display leading-tight font-semibold tracking-heading text-ink",
          nameClassName,
        )}
      >
        {brand.name}
      </span>
    );
  }

  return (
    <Image
      src={brand.logoUrl}
      alt=""
      width={brand.logoWidth ?? 400}
      height={brand.logoHeight ?? 300}
      unoptimized
      style={{ width: logoWidth(brand, baseWidth) }}
      className="h-auto max-h-[52%] object-contain mix-blend-multiply transition-[scale] duration-500 ease-(--ease-out) group-hover:scale-[1.05] motion-reduce:transition-none"
    />
  );
}
