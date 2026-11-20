import type { CountryCode } from "@cosmo/shared";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { buildWorldMapLayout } from "@/lib/world-map";
import { WorldMapInteractive } from "./world-map-interactive";

const MONGOLIA_REGION = "MN";

interface WorldMapSectionProps {
  countries: CountryCode[];
  locale: Locale;
}

export async function WorldMapSection({
  countries,
  locale,
}: WorldMapSectionProps) {
  const t = await getTranslations("home");
  const layout = buildWorldMapLayout(countries);

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
      className="world-map-section overflow-hidden text-white"
    >
      <WorldMapInteractive
        layout={layout}
        countryNames={countryNames}
        mongoliaName={displayNames.of(MONGOLIA_REGION) ?? MONGOLIA_REGION}
      >
        <h2 id="world-map-title" className="type-section text-balance">
          {t("mapTitle")}
        </h2>
        <p className="text-lg leading-relaxed text-balance text-night-text">
          {t("mapDescription")}
        </p>
      </WorldMapInteractive>
    </section>
  );
}
