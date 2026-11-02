import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { repeatToFill } from "@/lib/marquee";
import type { PublicBrand } from "@/lib/public-api";
import { brandPath } from "@/lib/site-links";
import { LogoMarquee } from "./logo-marquee";

const MAX_VISIBLE_TILES = 8;
const SECONDS_PER_TILE = 2.5;

interface BrandMarqueeProps {
  brands: PublicBrand[];
}

export async function BrandMarquee({ brands }: BrandMarqueeProps) {
  const t = await getTranslations("home");

  if (brands.length === 0) {
    return null;
  }

  const tiles = repeatToFill(brands, MAX_VISIBLE_TILES + 1);

  return (
    <section aria-label={t("brandsTitle")} className="bg-white py-1">
      <LogoMarquee tileCount={tiles.length} secondsPerTile={SECONDS_PER_TILE}>
        {tiles.map((brand, index) => (
          <Link
            key={`${brand.slug}-${index}`}
            href={brandPath(brand.slug)}
            tabIndex={index >= brands.length ? -1 : undefined}
            aria-hidden={index >= brands.length || undefined}
            className="mr-(--gap) flex aspect-square w-[calc((100cqw-(var(--count)-1)*var(--gap))/var(--count))] shrink-0 items-center justify-center rounded-card outline-offset-[-4px] outline-brand transition-[scale] duration-150 ease-out [--count:3] [--gap:30px] focus-visible:outline-2 motion-safe:active:scale-[0.97] md:[--count:5] lg:[--count:8]"
          >
            {brand.logoUrl ? (
              <span className="relative h-[46%] w-[62%]">
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  fill
                  unoptimized
                  sizes="160px"
                  className="object-contain"
                />
              </span>
            ) : (
              <span className="font-display text-xl font-semibold text-ink">
                {brand.name}
              </span>
            )}
          </Link>
        ))}
      </LogoMarquee>
    </section>
  );
}
