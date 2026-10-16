import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CeoMessage } from "@/components/site/about/ceo-message";
import { HistoryTimeline } from "@/components/site/about/history-timeline";
import { PartnerBand } from "@/components/site/about/partner-band";
import { ValuesList } from "@/components/site/about/values-list";
import { PageBanner } from "@/components/site/page-banner";
import { getPageLocale } from "@/i18n/locale";
import { ABOUT_BANNER_IMAGE, AWARDS, CEO_MESSAGE, VALUES } from "@/lib/about";
import { fetchMilestones } from "@/lib/public-api";
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
  const [t, milestones] = await Promise.all([
    getTranslations({ locale }),
    fetchMilestones(locale),
  ]);

  return (
    <>
      <PageBanner title={t("nav.about")} imageUrl={ABOUT_BANNER_IMAGE} />
      <CeoMessage title={t("about.ceoTitle")} data={CEO_MESSAGE} />
      <HistoryTimeline
        title={t("about.historyTitle")}
        milestones={milestones}
        awards={AWARDS}
      />
      <ValuesList
        title={t("about.valuesTitle")}
        careersLabel={t("nav.careers")}
        values={VALUES}
      />
      <div className="mt-24 md:mt-32 xl:mt-40">
        <PartnerBand />
      </div>
    </>
  );
}
