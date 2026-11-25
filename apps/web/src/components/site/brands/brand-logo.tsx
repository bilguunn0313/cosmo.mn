import Image from "next/image";
import type { PublicBrand } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const DEFAULT_MAX_WIDTH = 66;

interface LogoSource {
  url: string;
  width: number | null;
  height: number | null;
}

function logoSource(brand: PublicBrand): LogoSource | null {
  if (brand.logoUrl) {
    return {
      url: brand.logoUrl,
      width: brand.logoWidth,
      height: brand.logoHeight,
    };
  }

  return null;
}

function logoWidth(logo: LogoSource, baseWidth: number, maxWidth: number) {
  if (!logo.width || !logo.height) {
    return `${baseWidth}%`;
  }

  const ratio = logo.width / logo.height;
  const width = Math.min(
    maxWidth,
    Math.max(baseWidth * 0.7, baseWidth * Math.sqrt(ratio)),
  );

  return `${Math.round(width)}%`;
}

interface BrandLogoProps {
  brand: PublicBrand;
  baseWidth: number;
  maxWidth?: number;
  nameClassName?: string;
  className?: string;
}

export function BrandLogo({
  brand,
  baseWidth,
  maxWidth = DEFAULT_MAX_WIDTH,
  nameClassName,
  className,
}: BrandLogoProps) {
  const logo = logoSource(brand);

  if (!logo) {
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
      src={logo.url}
      alt=""
      width={logo.width ?? 400}
      height={logo.height ?? 300}
      unoptimized
      style={{ width: logoWidth(logo, baseWidth, maxWidth) }}
      className={cn(
        "h-auto max-h-[52%] object-contain mix-blend-multiply transition-[scale] duration-500 ease-(--ease-out) group-hover:scale-[1.05] motion-reduce:transition-none",
        className,
      )}
    />
  );
}
