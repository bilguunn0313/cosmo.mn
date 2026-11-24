import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { Link } from "@/i18n/navigation";
import type { BrandNeighbors } from "@/lib/brand-neighbors";
import type { PublicBrand } from "@/lib/public-api";
import { brandPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";
import { BRAND_TILE_BACKGROUND } from "./brand-tile-background";

const MAX_SEGMENTS = 24;

interface PagerLinkProps {
  brand: PublicBrand;
  label: string;
  isNext: boolean;
}

function PagerLink({ brand, label, isNext }: PagerLinkProps) {
  const Arrow = isNext ? ArrowRight : ArrowLeft;

  return (
    <Link
      href={brandPath(brand.slug)}
      rel={isNext ? "next" : "prev"}
      className={cn(
        "group row-start-2 flex flex-col gap-3 outline-offset-4 outline-brand focus-visible:outline-2 lg:row-start-1 lg:flex-row lg:items-center lg:gap-5.5",
        isNext
          ? "items-end text-right lg:col-start-3 lg:flex-row-reverse"
          : "items-start",
      )}
    >
      <span
        className={cn(
          "grid size-18 shrink-0 place-items-center overflow-hidden rounded-[14px] transition-[translate,box-shadow] duration-300 ease-(--ease-out) group-hover:-translate-y-1 group-hover:shadow-[0_16px_30px_-18px_rgb(11_31_51/0.45)] motion-reduce:transition-none lg:size-26 lg:rounded-[18px]",
          BRAND_TILE_BACKGROUND,
        )}
      >
        <BrandLogo brand={brand} baseWidth={62} nameClassName="text-xs" />
      </span>
      <span className="grid gap-1.5">
        <span
          className={cn(
            "flex items-center gap-2 font-display text-[11px] leading-snug font-semibold tracking-[0.12em] text-brand-700 uppercase lg:text-[13px] lg:tracking-[0.14em]",
            isNext && "justify-end",
          )}
        >
          {!isNext && (
            <Arrow className="size-3.5 transition-[translate] duration-200 ease-out group-hover:-translate-x-0.5 lg:size-4" />
          )}
          {label}
          {isNext && (
            <Arrow className="size-3.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5 lg:size-4" />
          )}
        </span>
        <span className="font-display text-xl leading-tight font-semibold text-balance text-ink transition-colors duration-200 group-hover:text-brand lg:text-[28px]">
          {brand.name}
        </span>
      </span>
    </Link>
  );
}

export async function BrandPager({
  previous,
  next,
  position,
  total,
}: BrandNeighbors) {
  const t = await getTranslations("brands.pager");

  return (
    <nav aria-label={t("label")} data-flush-footer className="pb-18 md:pb-26">
      <div className="site-container">
        <Reveal className="grid grid-cols-2 items-center gap-x-3 gap-y-5 border-y border-rule py-5.5 lg:grid-cols-[1fr_auto_1fr] lg:gap-10 lg:py-8">
          <PagerLink brand={previous} label={t("previous")} isNext={false} />

          <div className="col-span-2 row-start-1 flex flex-col items-center gap-2 lg:col-span-1 lg:col-start-2 lg:gap-3">
            <p className="font-display text-base leading-none text-ink-3">
              <span className="sr-only">
                {t("position", { position, total })}
              </span>
              <span aria-hidden>
                <span className="text-[26px] font-semibold text-ink tabular-nums">
                  {String(position).padStart(2, "0")}
                </span>{" "}
                / {total}
              </span>
            </p>
            {total <= MAX_SEGMENTS && (
              <span aria-hidden className="flex gap-1">
                {Array.from({ length: total }, (_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "h-1 w-2.5 rounded-full bg-brand-200",
                      index + 1 === position && "w-5.5 bg-coral",
                    )}
                  />
                ))}
              </span>
            )}
            <Link
              href="/brands#catalog"
              className="text-sm text-ink-2 underline-offset-4 transition-colors duration-150 hover:text-brand hover:underline"
            >
              {t("all")}
            </Link>
          </div>

          <PagerLink brand={next} label={t("next")} isNext />
        </Reveal>
      </div>
    </nav>
  );
}
