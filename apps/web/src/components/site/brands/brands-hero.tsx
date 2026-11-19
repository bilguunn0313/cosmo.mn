import { getTranslations } from "next-intl/server";
import { LogoMark } from "@/components/site/logo-mark";
import { PAGE_BANNER_ID } from "@/components/site/site-nav";
import { Link } from "@/i18n/navigation";
import type { PublicBrand } from "@/lib/public-api";
import { brandPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";
import { BRAND_TILE_BACKGROUND } from "./brand-tile-background";

const WALL_COLUMNS = 4;
const WALL_SIZE = 12;
const MIN_WALL_SIZE = 4;
const MOBILE_WALL_SIZE = 8;

function wallBrands(brands: PublicBrand[]) {
  const withLogo = brands.filter((brand) => brand.logoUrl);
  const withoutLogo = brands.filter((brand) => !brand.logoUrl);
  const fullRows = Math.floor(brands.length / WALL_COLUMNS) * WALL_COLUMNS;

  return [...withLogo, ...withoutLogo].slice(0, Math.min(WALL_SIZE, fullRows));
}

interface BrandsHeroProps {
  brands: PublicBrand[];
  children?: React.ReactNode;
}

export async function BrandsHero({ brands, children }: BrandsHeroProps) {
  const t = await getTranslations();
  const wall = wallBrands(brands);
  const hasWall = wall.length >= MIN_WALL_SIZE;

  return (
    <section
      id={PAGE_BANNER_ID}
      aria-labelledby="brands-title"
      className="relative isolate overflow-hidden bg-brand text-white"
    >
      <LogoMark className="absolute -bottom-65 -left-45 -z-10 w-170 text-white/5" />

      <div
        className={cn(
          "site-container grid items-center gap-10 py-14 md:py-18 lg:min-h-130 lg:gap-16",
          hasWall && "lg:grid-cols-[5fr_7fr]",
        )}
      >
        <div className="grid justify-items-start gap-4.5">
          <h1
            id="brands-title"
            className="hero-rise type-hero text-balance [--rise-delay:100ms]"
          >
            {t("nav.brands")}
          </h1>
          <p className="hero-rise max-w-115 text-lg/relaxed text-pretty text-brand-200 [--rise-delay:240ms] md:text-[19px]">
            {t("brands.description")}
          </p>
          {children && (
            <div className="hero-rise mt-3 flex flex-col items-start gap-5 [--rise-delay:380ms]">
              {children}
            </div>
          )}
        </div>

        {hasWall && (
          <ul className="grid grid-cols-4 gap-2.5 pb-6 md:gap-3.5">
            {wall.map((brand, index) => (
              <li
                key={brand.slug}
                className={cn(
                  "hero-rise even:translate-y-6",
                  index >= MOBILE_WALL_SIZE && "max-lg:hidden",
                )}
                style={
                  {
                    "--rise-delay": `${300 + index * 50}ms`,
                  } as React.CSSProperties
                }
              >
                <Link
                  href={brandPath(brand.slug)}
                  aria-label={brand.name}
                  className={cn(
                    "group flex aspect-4/3 items-center justify-center rounded-[18px] shadow-[0_18px_36px_-24px_color-mix(in_srgb,var(--color-brand-night)_70%,transparent)] outline-offset-3 outline-white transition-[scale] duration-400 ease-(--ease-out) hover:scale-[1.04] focus-visible:outline-2 motion-reduce:transition-none",
                    BRAND_TILE_BACKGROUND,
                  )}
                >
                  <BrandLogo
                    brand={brand}
                    baseWidth={34}
                    nameClassName="px-1.5 text-[13px] md:text-[17px]"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
