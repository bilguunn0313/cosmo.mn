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
      className="border-b border-rule bg-white"
    >
      <h2 id="brands-marquee-title" className="sr-only">
        {t("officialDistributor")}
      </h2>
      <div className="flex">
        <MarqueeRow brands={brands} />
      </div>
    </section>
  );
}
