import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { PublicBrand } from "@/lib/public-api";
import { brandPath } from "@/lib/site-links";

interface BrandVisualProps {
  brand: PublicBrand;
}

function BrandVisual({ brand }: BrandVisualProps) {
  if (brand.showcaseImageUrl) {
    return (
      <>
        <Image
          src={brand.showcaseImageUrl}
          alt={brand.name}
          fill
          unoptimized
          sizes="320px"
          className="object-contain px-[14%] pt-[12%] pb-[22%] transition-[scale] duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
        />
        {brand.logoUrl && (
          <span className="absolute bottom-4 left-4 size-16 overflow-hidden rounded-full bg-white shadow-[0_4px_16px_color-mix(in_srgb,var(--color-brand-900)_14%,transparent)] md:size-18">
            <Image
              src={brand.logoUrl}
              alt=""
              fill
              unoptimized
              sizes="72px"
              className="object-contain p-2.5"
            />
          </span>
        )}
      </>
    );
  }

  if (brand.logoUrl) {
    return (
      <Image
        src={brand.logoUrl}
        alt={brand.name}
        fill
        unoptimized
        sizes="320px"
        className="object-contain p-[22%] mix-blend-multiply transition-[scale] duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none"
      />
    );
  }

  return (
    <span className="absolute inset-0 grid place-items-center p-8 text-center text-3xl font-semibold tracking-heading text-ink-3">
      {brand.name}
    </span>
  );
}

interface BrandTileProps {
  brand: PublicBrand;
  meta?: string;
}

export function BrandTile({ brand, meta }: BrandTileProps) {
  return (
    <Link
      href={brandPath(brand.slug)}
      className="group flex h-full flex-col outline-offset-4 outline-brand focus-visible:outline-2"
    >
      <span className="relative block aspect-4/5 overflow-hidden rounded-card bg-[radial-gradient(circle_at_50%_45%,white_35%,var(--color-brand-100)_70%,var(--color-brand-200))]">
        <BrandVisual brand={brand} />
      </span>
      <span className="flex items-center justify-between gap-3 pt-4">
        <span className="grid min-w-0 gap-1">
          <span className="type-h4 wrap-anywhere transition-colors duration-150 group-hover:text-brand-700">
            {brand.name}
          </span>
          {meta && (
            <span className="text-[13px] font-semibold text-brand-700">
              {meta}
            </span>
          )}
        </span>
        <ArrowRight className="size-5 shrink-0 text-brand transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
