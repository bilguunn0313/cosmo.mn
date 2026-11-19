import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HrDirectionsSection } from "@/components/site/careers/hr-directions-section";
import { HrGovernanceSection } from "@/components/site/careers/hr-governance-section";
import { HrPolicySection } from "@/components/site/careers/hr-policy-section";
import { PartnerCtaSection } from "@/components/site/home/partner-cta-section";
import { StorySections } from "@/components/site/story-sections";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { pageBannerUrl } from "@/lib/page-banners";
import { fetchJobs, fetchSections, fetchSiteSetting } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";
import { JOBS_PATH, jobPath } from "@/lib/site-links";

const MAX_BAND_JOBS = 4;

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

  return (
    <>
      <HrPolicySection imageUrl={pageBannerUrl(setting, "careers")} />
      <HrDirectionsSection />
      <HrGovernanceSection imageUrl={pageBannerUrl(setting, "hrGovernance")} />

      {sections.length > 0 && (
        <div className="site-container pt-20 md:pt-32">
          <StorySections sections={sections} />
        </div>
      )}

      {jobs.length > 0 ? (
        <PartnerCtaSection
          eyebrow={t("jobs.title")}
          title={t("jobs.bandTitle", { count: jobs.length })}
          text={t("jobs.bandText")}
          href={JOBS_PATH}
          buttonLabel={t("jobs.bandButton")}
          className="mt-20 md:mt-32"
        >
          <ul className="flex flex-wrap justify-center gap-2.5">
            {jobs.slice(0, MAX_BAND_JOBS).map((job) => (
              <li key={job.slug}>
                <Link
                  href={jobPath(job.slug)}
                  className="group inline-flex h-11.5 items-center gap-2.5 rounded-full bg-white px-5 text-[15px] font-medium text-brand-700 shadow-[0_0_0_1px_var(--color-brand-200)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_var(--color-brand)]"
                >
                  {job.title}
                  <ArrowRight className="size-4 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </PartnerCtaSection>
      ) : (
        setting?.facebookUrl && (
          <PartnerCtaSection
            eyebrow={t("jobs.title")}
            title={t("jobs.emptyTitle")}
            text={`${t("jobs.emptyText")} ${t("jobs.followText")}`}
            href={setting.facebookUrl}
            buttonLabel={t("jobs.followButton")}
            className="mt-20 md:mt-32"
          />
        )
      )}
    </>
  );
}
