import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AboutHero } from "@/components/site/about/about-hero";
import { CeoMessage } from "@/components/site/about/ceo-message";
import { CompanyIntro } from "@/components/site/about/company-intro";
import { HistoryTimeline } from "@/components/site/about/history-timeline";
import { NetworkSection } from "@/components/site/about/network-section";
import { PurposeSection } from "@/components/site/about/purpose-section";
import { WhatWeDoSection } from "@/components/site/about/what-we-do-section";
import { PartnerCtaSection } from "@/components/site/home/partner-cta-section";
import { getPageLocale } from "@/i18n/locale";
import { homeStats } from "@/lib/home-stats";
import { pageBannerUrl } from "@/lib/page-banners";
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
  const stats = homeStats(setting, locale);

  return (
    <>
      <AboutHero imageUrl={pageBannerUrl(setting, "about")} />
      <CompanyIntro />
      <CeoMessage />
      <PurposeSection setting={setting} />
      <HistoryTimeline
        eyebrow={t("about.historyTitle")}
        title={
          stats.years
            ? t("about.historyHeading", { years: stats.years })
            : t("about.historyHeadingPlain")
        }
        milestones={milestones}
      />
      <WhatWeDoSection />
      <NetworkSection salesPoints={stats.salesPoints} />
      <PartnerCtaSection
        title={t("about.partnerTitle")}
        text={t("about.partnerText")}
        isDark
      />
    </>
  );
}
