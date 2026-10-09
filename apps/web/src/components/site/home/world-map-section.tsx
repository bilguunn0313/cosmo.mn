import { getTranslations } from "next-intl/server";
import type { PublicBrand } from "@/lib/public-api";
import type { Locale } from "@/lib/types";
import { buildWorldMapLayout } from "@/lib/world-map";
import { WorldMapInteractive } from "./world-map-interactive";

interface WorldMapSectionProps {
  brands: PublicBrand[];
  locale: Locale;
}

export async function WorldMapSection({
  brands,
  locale,
}: WorldMapSectionProps) {
  const t = await getTranslations("home");
  const layout = buildWorldMapLayout(brands);

  if (!layout || layout.origins.length === 0) {
    return null;
  }

  const displayNames = new Intl.DisplayNames([locale], { type: "region" });
  const countryNames = Object.fromEntries(
    layout.origins.map(({ code }) => [code, displayNames.of(code) ?? code]),
  );

  return (
    <section
      aria-labelledby="world-map-title"
      className="site-container-wide py-14 md:py-24"
    >
      <div className="grid gap-10 rounded-3xl bg-brand-night px-4 py-10 text-white sm:px-8 md:gap-14 md:rounded-[2rem] md:py-16 lg:px-14">
        <div className="grid max-w-2xl gap-4 px-2 sm:px-0">
          <h2
            id="world-map-title"
            className="text-3xl leading-[1.1] font-semibold tracking-tight text-balance md:text-5xl"
          >
            {t("mapTitle", { count: layout.origins.length })}
          </h2>
          <p className="text-lg text-white/70">{t("mapDescription")}</p>
        </div>

        <WorldMapInteractive layout={layout} countryNames={countryNames} />
      </div>
    </section>
  );
}
