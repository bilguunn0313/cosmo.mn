import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AboutHero } from "@/components/site/about/about-hero";
import { AboutStatsBand } from "@/components/site/about/about-stats-band";
import { AboutStory } from "@/components/site/about/about-story";
import { HistoryStrip } from "@/components/site/about/history-strip";
import { PartnerBand } from "@/components/site/about/partner-band";
import { ValuesGrid } from "@/components/site/about/values-grid";
import { WorldMapSection } from "@/components/site/home/world-map-section";
import { getPageLocale } from "@/i18n/locale";
import {
  fetchBrands,
  fetchMilestones,
  fetchSections,
  fetchSiteSetting,
} from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale });

  return pageMetadata({
    locale,
    path: "/about",
    title: t("nav.about"),
    description: t("seo.aboutDescription"),
  });
}

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const locale = await getPageLocale(params);
  const [sections, milestones, setting, brands] = await Promise.all([
    fetchSections("about", locale),
    fetchMilestones(locale),
    fetchSiteSetting(locale),
    fetchBrands(locale),
  ]);

  return (
    <>
      <AboutHero />
      <AboutStory sections={sections} />
      <AboutStatsBand setting={setting} brands={brands} />
      {milestones.length > 0 && <HistoryStrip milestones={milestones} />}
      <ValuesGrid />
      <div className="mt-20 md:mt-36">
        <WorldMapSection brands={brands} locale={locale} />
      </div>
      <PartnerBand />
    </>
  );
}
