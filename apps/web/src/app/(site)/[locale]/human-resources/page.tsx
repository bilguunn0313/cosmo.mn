import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ApplicationForm } from "@/components/site/careers/application-form";
import { CareersIntro } from "@/components/site/careers/careers-intro";
import { CareersStats } from "@/components/site/careers/careers-stats";
import { DepartmentChart } from "@/components/site/careers/department-chart";
import { GrowthSection } from "@/components/site/careers/growth-section";
import { PrinciplesBand } from "@/components/site/careers/principles-band";
import { StorySections } from "@/components/site/story-sections";
import { getPageLocale } from "@/i18n/locale";
import { totalEmployees } from "@/lib/hr-facts";
import { pageBannerUrl } from "@/lib/page-banners";
import { fetchSections, fetchSiteSetting } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";

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
  const t = await getTranslations("careers.form");
  const [sections, setting] = await Promise.all([
    fetchSections("human-resources", locale),
    fetchSiteSetting(locale),
  ]);

  return (
    <>
      <CareersIntro imageUrl={pageBannerUrl(setting, "careers")} />
      <CareersStats employeeCount={totalEmployees()} />
      <DepartmentChart />
      <GrowthSection />

      {sections.length > 0 && (
        <div className="site-container pt-20 md:pt-32">
          <StorySections sections={sections} />
        </div>
      )}

      <PrinciplesBand />

      <section
        id="anket"
        aria-labelledby="application-title"
        className="site-container grid scroll-mt-28 gap-10 pt-20 md:pt-36 lg:grid-cols-12 lg:gap-x-6"
      >
        <div className="grid content-start gap-5 lg:sticky lg:top-30 lg:col-span-4 lg:self-start">
          <h2 id="application-title" className="type-h2">
            {t("title")}
          </h2>
          <p className="max-w-95 text-base leading-relaxed text-ink-2">
            {t("intro")}
          </p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <ApplicationForm />
        </div>
      </section>
    </>
  );
}
