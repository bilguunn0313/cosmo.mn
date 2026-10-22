import { getTranslations } from "next-intl/server";
import type { PublicBrand } from "@/lib/public-api";
import { MarqueeRow } from "./marquee-row";

const TWO_ROW_MIN_BRANDS = 8;

function splitIntoRows(brands: PublicBrand[]) {
  if (brands.length < TWO_ROW_MIN_BRANDS) {
    return [brands];
  }

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

  return (
    <section
      aria-labelledby="brands-marquee-title"
      className="pt-20 md:pt-32"
    >
      <div className="site-container">
        <h2 id="brands-marquee-title" className="type-h2 text-balance">
          {t("partnersTitle")}
        </h2>
        <span
          aria-hidden
          className="mt-4 block h-[3px] rounded-full bg-linear-to-r from-brand via-brand-400 via-25% to-rule md:mt-5"
        />
      </div>

      <div className="mt-10 grid gap-8 md:mt-14 md:gap-12">
        {splitIntoRows(brands).map((row, index) => (
          <MarqueeRow key={index} brands={row} isReversed={index === 1} />
        ))}
      </div>
    </section>
  );
}
