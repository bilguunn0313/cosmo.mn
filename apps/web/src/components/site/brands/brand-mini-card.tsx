import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { PublicBrand } from "@/lib/public-api";
import { brandPath } from "@/lib/site-links";

interface BrandMiniCardProps {
  brand: PublicBrand;
}

export function BrandMiniCard({ brand }: BrandMiniCardProps) {
  return (
    <Link
      href={brandPath(brand.slug)}
      className="group flex h-full flex-col bg-paper outline-offset-[-2px] outline-brand transition-colors duration-200 hover:bg-brand-100 focus-visible:outline-2"
    >
      <span className="relative block h-28 bg-white md:h-35">
        {brand.logoUrl && (
          <Image
            src={brand.logoUrl}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1280px) 25vw, 50vw"
            className="object-contain px-6 py-5 md:px-8 md:py-7"
          />
        )}
      </span>
      <span className="flex items-center justify-between gap-3 border-t border-rule px-4 py-4 md:px-5">
        <span className="min-w-0 type-h4 wrap-anywhere">{brand.name}</span>
        <ArrowRight className="size-4.5 shrink-0 text-brand transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
