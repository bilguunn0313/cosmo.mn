import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";
import { Link } from "@/i18n/navigation";
import type { PublicBrand } from "@/lib/public-api";
import { brandPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";

export const BENTO_MAX_BRANDS = 5;

type CellSize = "large" | "medium" | "small";

interface BentoCell {
  span: string;
  size: CellSize;
}

interface BentoLayout {
  columns: string;
  cells: BentoCell[];
}

const LAYOUTS: Record<number, BentoLayout> = {
  1: {
    columns: "md:grid-cols-1",
    cells: [{ span: "col-span-2 row-span-2", size: "large" }],
  },
  2: {
    columns: "md:grid-cols-2",
    cells: [
      { span: "col-span-2 row-span-2 md:col-span-1", size: "large" },
      { span: "col-span-2 md:col-span-1 md:row-span-2", size: "large" },
    ],
  },
  3: {
    columns: "md:grid-cols-2",
    cells: [
      { span: "col-span-2 row-span-2 md:col-span-1", size: "large" },
      { span: "", size: "medium" },
      { span: "", size: "medium" },
    ],
  },
  4: {
    columns: "md:grid-cols-4",
    cells: [
      { span: "col-span-2 row-span-2", size: "large" },
      { span: "col-span-2", size: "medium" },
      { span: "", size: "small" },
      { span: "", size: "small" },
    ],
  },
  5: {
    columns: "md:grid-cols-6",
    cells: [
      { span: "col-span-2 row-span-2 md:col-span-3", size: "large" },
      { span: "col-span-2 md:col-span-3", size: "medium" },
      { span: "", size: "small" },
      { span: "", size: "small" },
      { span: "col-span-2 md:col-span-1", size: "small" },
    ],
  },
};

const IMAGE_SIZES: Record<CellSize, string> = {
  large: "(min-width: 768px) 50vw, 100vw",
  medium: "(min-width: 768px) 50vw, 100vw",
  small: "(min-width: 768px) 17vw, 50vw",
};

interface CellVisualProps {
  brand: PublicBrand;
  size: CellSize;
}

function CellVisual({ brand, size }: CellVisualProps) {
  if (brand.coverUrl) {
    return (
      <Image
        src={brand.coverUrl}
        alt=""
        fill
        unoptimized
        sizes={IMAGE_SIZES[size]}
        className="-z-20 object-cover transition-[scale] duration-900 ease-out group-hover:scale-105 motion-reduce:transition-none"
      />
    );
  }

  return (
    <span className="absolute inset-0 -z-20 overflow-hidden bg-linear-to-br from-brand to-brand-night">
      <LogoMark className="absolute -right-[12%] -bottom-[20%] w-[72%] text-white/[0.06]" />
      {brand.logoUrl && (
        <span className="absolute inset-x-0 top-0 bottom-16 grid place-items-center">
          <span className="relative aspect-square w-[min(52%,9rem)] rounded-full bg-white shadow-[0_12px_30px_color-mix(in_srgb,var(--color-brand-night)_30%,transparent)] transition-[scale] duration-900 ease-out group-hover:scale-105 motion-reduce:transition-none">
            <Image
              src={brand.logoUrl}
              alt=""
              fill
              unoptimized
              sizes="144px"
              className="object-contain p-[18%]"
            />
          </span>
        </span>
      )}
    </span>
  );
}

interface BentoCardProps {
  brand: PublicBrand;
  size: CellSize;
  categoryLabel: string;
}

function BentoCard({ brand, size, categoryLabel }: BentoCardProps) {
  return (
    <Link
      href={brandPath(brand.slug)}
      className="group relative isolate block size-full overflow-hidden rounded-card bg-brand-night text-white outline-offset-4 outline-brand focus-visible:outline-2"
    >
      <CellVisual brand={brand} size={size} />
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-brand-night/80 via-brand-night/10 to-transparent"
      />

      <span
        aria-hidden
        className="absolute top-4 right-4 grid size-10 -translate-x-1 translate-y-1 place-items-center rounded-control bg-white/15 opacity-0 transition-[opacity,translate] duration-300 ease-out group-hover:translate-0 group-hover:opacity-100 group-focus-visible:translate-0 group-focus-visible:opacity-100"
      >
        <ArrowUpRight className="size-5" />
      </span>

      <span
        className={cn(
          "absolute flex items-center gap-3",
          size === "large"
            ? "inset-x-5 bottom-5 md:inset-x-7 md:bottom-7"
            : "inset-x-4 bottom-4",
        )}
      >
        {brand.coverUrl && brand.logoUrl && (
          <span
            className={cn(
              "relative shrink-0 rounded-control bg-white",
              size === "large" ? "size-14 md:size-16" : "size-12",
              size === "small" && "md:hidden",
            )}
          >
            <Image
              src={brand.logoUrl}
              alt=""
              fill
              unoptimized
              sizes="64px"
              className="object-contain p-1.5"
            />
          </span>
        )}
        <span className="grid min-w-0 gap-0.5">
          <span
            className={cn(
              "wrap-anywhere",
              size === "large" ? "type-h3" : "type-h4",
            )}
          >
            {brand.name}
          </span>
          <span className="text-[13px] text-white/80">{categoryLabel}</span>
        </span>
      </span>
    </Link>
  );
}

interface BrandBentoProps {
  brands: PublicBrand[];
}

export async function BrandBento({ brands }: BrandBentoProps) {
  const t = await getTranslations("categories");
  const shownBrands = brands.slice(0, BENTO_MAX_BRANDS);
  const layout = LAYOUTS[shownBrands.length];

  if (!layout) {
    return null;
  }

  return (
    <ul
      className={cn(
        "mt-4 grid auto-rows-[190px] grid-cols-2 gap-3 md:auto-rows-[236px] md:gap-3.5",
        layout.columns,
      )}
    >
      {shownBrands.map((brand, index) => (
        <li key={brand.slug} className={layout.cells[index].span}>
          <Reveal index={index} className="size-full">
            <BentoCard
              brand={brand}
              size={layout.cells[index].size}
              categoryLabel={brand.categories
                .map((category) => t(category))
                .join(", ")}
            />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
