import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MilestoneTimeline } from "@/components/site/about/milestone-timeline";
import { CtaCard, ctaButtonClass } from "@/components/site/cta-card";
import { StatsSection } from "@/components/site/home/stats-section";
import { WorldMapSection } from "@/components/site/home/world-map-section";
import { SectionHeader } from "@/components/site/section-header";
import { StorySections } from "@/components/site/story-sections";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import {
  fetchBrands,
  fetchMilestones,
  fetchSections,
  fetchSiteSetting,
} from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

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
  const [sections, milestones, setting, brands] = await Promise.all([
    fetchSections("about", locale),
    fetchMilestones(locale),
    fetchSiteSetting(locale),
    fetchBrands(locale),
  ]);

  return (
    <>
      <div className="site-container-wide grid gap-8 pt-8 md:gap-10 md:pt-14">
        <div className="grid gap-4">
          <SectionHeader as="h1" id="about-title" title={t("nav.about")} />
          <p className="max-w-2xl text-lg text-muted-foreground">
            {t("about.description")}
          </p>
        </div>

        {sections.length > 0 && <StorySections sections={sections} />}
      </div>

      <StatsSection setting={setting} brands={brands} />

      {milestones.length > 0 && (
        <section
          aria-labelledby="history-title"
          className="site-container-wide grid gap-10 pt-16 md:gap-14 md:pt-24"
        >
          <SectionHeader id="history-title" title={t("about.historyTitle")} />
          <MilestoneTimeline milestones={milestones} />
        </section>
      )}

      <div className="pt-12 md:pt-20">
        <WorldMapSection brands={brands} locale={locale} />
      </div>

      <div className="site-container-wide pt-4 md:pt-6">
        <CtaCard
          id="partner-title"
          title={t("about.partnerTitle")}
          text={t("about.partnerText")}
        >
          <Link
            href="/contact"
            className={cn(
              ctaButtonClass,
              "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {t("nav.contact")}
            <ArrowUpRight className="size-4" />
          </Link>
        </CtaCard>
      </div>
    </>
  );
}
