import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HrBenefitsSection } from "@/components/site/careers/hr-benefits-section";
import { HrCultureSection } from "@/components/site/careers/hr-culture-section";
import { HrJobsSection } from "@/components/site/careers/hr-jobs-section";
import { HrPolicySection } from "@/components/site/careers/hr-policy-section";
import { HrSelectionSection } from "@/components/site/careers/hr-selection-section";
import { StorySections } from "@/components/site/story-sections";
import { getPageLocale } from "@/i18n/locale";
import { pageBannerUrl } from "@/lib/page-banners";
import { fetchJobs, fetchSections, fetchSiteSetting } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";
import { JOBS_PATH } from "@/lib/site-links";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/human-resources">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale });

  return pageMetadata({
    locale,
    path: "/human-resources",
    title: t("seo.careersTitle"),
    description: t("seo.careersDescription"),
  });
}

export default async function HumanResourcesPage({
  params,
}: PageProps<"/[locale]/human-resources">) {
  const locale = await getPageLocale(params);
  const t = await getTranslations("careers");
  const [sections, setting, jobs] = await Promise.all([
    fetchSections("human-resources", locale),
    fetchSiteSetting(locale),
    fetchJobs(locale),
  ]);
  const hasStories = sections.length > 0;
  const jobsSpacing = hasStories ? "mt-20 md:mt-32" : undefined;
  const jobsImageUrl = pageBannerUrl(setting, "hrJobs");

  return (
    <>
      <HrPolicySection imageUrl={pageBannerUrl(setting, "careers")} />
      <HrCultureSection imageUrl={pageBannerUrl(setting, "hrGovernance")} />
      <HrBenefitsSection />
      <HrSelectionSection />

      {hasStories && (
        <div className="site-container pt-20 md:pt-32">
          <StorySections sections={sections} />
        </div>
      )}

      {jobs.length > 0 ? (
        <HrJobsSection
          title={t("jobs.bandTitle")}
          lead={t("jobs.countLead")}
          count={jobs.length}
          label={t("jobs.countLabel", { count: jobs.length })}
          href={JOBS_PATH}
          imageUrl={jobsImageUrl}
          imageAlt={t("jobs.imageAlt")}
          className={jobsSpacing}
        />
      ) : (
        <HrJobsSection
          title={t("jobs.bandTitle")}
          lead={t("jobs.emptyTitle")}
          imageUrl={jobsImageUrl}
          imageAlt={t("jobs.imageAlt")}
          className={jobsSpacing}
        />
      )}
    </>
  );
}
