import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { PublicBrand } from "@/lib/public-api";
import { brandPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";

interface BrandCardProps {
  brand: PublicBrand;
  countryName: string | null;
}

export function BrandCard({ brand, countryName }: BrandCardProps) {
  return (
    <Link
      href={brandPath(brand.slug)}
      className="group grid overflow-hidden rounded-3xl bg-card outline-offset-4 outline-primary transition-[scale] duration-150 ease-(--ease-out) focus-visible:outline-2 motion-safe:active:scale-[0.99] md:rounded-[2rem]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {brand.coverUrl && (
          <Image
            src={brand.coverUrl}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="scale-[1.04] object-cover opacity-0 transition-[opacity,scale] duration-500 ease-(--ease-out) group-hover:scale-100 group-hover:opacity-100 motion-reduce:scale-100"
          />
        )}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-300 ease-(--ease-out) sm:p-12",
            brand.coverUrl && "group-hover:opacity-0",
          )}
        >
          {brand.logoUrl ? (
            <span className="relative size-full">
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                fill
                unoptimized
                sizes="(min-width: 768px) 20vw, 40vw"
                className="object-contain"
              />
            </span>
          ) : (
            <span className="text-2xl font-semibold tracking-tight">
              {brand.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-foreground/5 px-5 py-4 md:px-6 md:py-5">
        <div className="grid min-w-0 gap-0.5">
          <h2 className="truncate text-base font-semibold tracking-tight md:text-lg">
            {brand.name}
          </h2>
          {countryName && (
            <p className="truncate text-sm text-muted-foreground">
              {countryName}
            </p>
          )}
        </div>
        <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-[color,translate] duration-200 ease-(--ease-out) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
      </div>
    </Link>
  );
}
