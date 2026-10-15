import { getTranslations } from "next-intl/server";
import type { PublicBrand } from "@/lib/public-api";
import { MarqueeRow } from "./marquee-row";

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
      className="border-t-2 border-rule bg-white"
    >
      <div className="site-container flex flex-col md:flex-row">
        <h2
          id="brands-marquee-title"
          className="eyebrow flex shrink-0 items-center border-b-2 border-rule py-5 text-ink-3 md:w-60 md:border-r-2 md:border-b-0 md:pr-6"
        >
          {t("officialDistributor")}
        </h2>
        <MarqueeRow brands={brands} />
      </div>
    </section>
  );
}
