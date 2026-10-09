import { getTranslations } from "next-intl/server";
import type { PublicBrand } from "@/lib/public-api";
import { MarqueeRow } from "./marquee-row";

const MIN_BRANDS_FOR_TWO_ROWS = 12;

function splitIntoTwoRows(brands: PublicBrand[]) {
  return [
    brands.filter((_, index) => index % 2 === 0),
    brands.filter((_, index) => index % 2 === 1),
  ];
}

interface BrandMarqueeProps {
  brands: PublicBrand[];
}

export async function BrandMarquee({ brands }: BrandMarqueeProps) {
  const t = await getTranslations("home");

  if (brands.length === 0) {
    return null;
  }

  const rows =
    brands.length >= MIN_BRANDS_FOR_TWO_ROWS
      ? splitIntoTwoRows(brands)
      : [brands];

  return (
    <section
      aria-labelledby="brands-marquee-title"
      className="site-container-wide grid gap-8 py-14 md:py-20"
    >
      <h2 id="brands-marquee-title" className="sr-only">
        {t("brandsTitle")}
      </h2>
      {rows.map((row, index) => (
        <MarqueeRow key={index} brands={row} reverse={index === 1} />
      ))}
    </section>
  );
}
