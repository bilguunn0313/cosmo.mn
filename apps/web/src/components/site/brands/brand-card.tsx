import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { PublicBrand } from "@/lib/public-api";
import { brandPath } from "@/lib/site-links";

interface BrandCardProps {
  brand: PublicBrand;
  countryName: string | null;
}

export async function BrandCard({ brand, countryName }: BrandCardProps) {
  const t = await getTranslations("categories");
  const categoryNames = brand.categories.map((category) => t(category));
  const meta = [categoryNames.join(", "), countryName]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={brandPath(brand.slug)}
      className="group flex h-full flex-col bg-paper outline-offset-[-2px] outline-brand focus-visible:outline-2"
    >
      <div className="relative h-32 bg-white sm:h-40 lg:h-50">
        {brand.logoUrl ? (
          <Image
            src={brand.logoUrl}
            alt={brand.name}
            fill
            unoptimized
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-contain p-6 transition-[scale] duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none sm:p-8 lg:px-10 lg:py-9"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-2xl font-semibold tracking-heading text-ink-3">
            {brand.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t border-rule p-4 transition-colors duration-200 group-hover:bg-brand-100 sm:gap-2.5 sm:px-6 sm:pt-5 sm:pb-6">
        <span className="flex items-center justify-between gap-3">
          <span className="min-w-0 type-h4 wrap-anywhere">{brand.name}</span>
          <ArrowRight className="size-5 shrink-0 text-brand transition-[translate] duration-200 ease-out group-hover:translate-x-0.5 sm:size-5.5" />
        </span>
        {meta && (
          <span className="text-xs font-semibold tracking-[0.04em] text-brand-700 sm:text-[13px]">
            {meta}
          </span>
        )}
        {brand.summary && (
          <span className="hidden text-[15px] leading-[1.45] text-ink-2 sm:line-clamp-2">
            {brand.summary}
          </span>
        )}
      </div>
    </Link>
  );
}
