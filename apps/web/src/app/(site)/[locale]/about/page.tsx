import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CeoMessage } from "@/components/site/about/ceo-message";
import { HistoryTimeline } from "@/components/site/about/history-timeline";
import { PurposeSection } from "@/components/site/about/purpose-section";
import { ValuesSection } from "@/components/site/about/values-section";
import { getPageLocale } from "@/i18n/locale";
import { fetchMilestones, fetchSiteSetting } from "@/lib/public-api";
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
  const t = await getTranslations();
  const [milestones, setting] = await Promise.all([
    fetchMilestones(locale),
    fetchSiteSetting(locale),
  ]);

  return (
    <>
      <h1 className="sr-only">{t("nav.about")}</h1>
      <CeoMessage photoUrl={setting?.ceoImageUrl ?? null} />
      <PurposeSection imageUrl={setting?.purposeImageUrl ?? null} />
      <ValuesSection />
      <HistoryTimeline milestones={milestones} />
    </>
  );
}
