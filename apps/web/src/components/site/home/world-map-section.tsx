import type { CountryCode } from "@cosmo/shared";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import type { Locale } from "@/lib/types";
import { buildWorldMapLayout } from "@/lib/world-map";
import { WorldMapInteractive } from "./world-map-interactive";

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
    <section aria-labelledby="world-map-title" className="bg-brand text-white">
      <div className="site-container grid gap-y-10 py-16 md:py-22 lg:grid-cols-12 lg:gap-x-6">
        <Reveal className="grid content-start gap-5 lg:col-span-4">
          <SectionEyebrow tone="white">{t("originEyebrow")}</SectionEyebrow>
          <h2 id="world-map-title" className="type-h2 text-balance">
            {t("mapTitle", { count: layout.origins.length })}
          </h2>
          <p className="text-base text-night-text">{t("mapDescription")}</p>
        </Reveal>

        <div className="border-2 border-white/28 p-3 md:p-6 lg:col-span-8">
          <WorldMapInteractive layout={layout} countryNames={countryNames} />
        </div>
      </div>
    </section>
  );
}
