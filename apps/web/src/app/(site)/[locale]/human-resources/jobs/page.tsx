import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JobsTable } from "@/components/site/careers/jobs-table";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { siteButtonClass } from "@/components/site/site-button";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { fetchJobs, fetchSiteSetting } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";
import { JOBS_PATH } from "@/lib/site-links";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/human-resources/jobs">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale });

  return pageMetadata({
    locale,
    path: JOBS_PATH,
    title: t("seo.jobsTitle"),
    description: t("seo.jobsDescription"),
  });
}

export default async function JobsPage({
  params,
}: PageProps<"/[locale]/human-resources/jobs">) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();
  const [jobs, setting] = await Promise.all([
    fetchJobs(locale),
    fetchSiteSetting(locale),
  ]);
  const facebookUrl = setting?.facebookUrl;

  return (
    <>
      <header className="site-container flex flex-wrap items-end justify-between gap-x-12 gap-y-5 pt-8 md:pt-14">
        <Reveal className="grid max-w-190 gap-5">
          <SectionEyebrow>{t("nav.careers")}</SectionEyebrow>
          <h1 className="type-section text-balance text-ink">
            {t("careers.jobs.title")}
          </h1>
          <p className="text-lg leading-relaxed text-pretty text-ink-2">
            {t("careers.jobs.intro")}
          </p>
        </Reveal>
        {jobs.length > 0 && (
          <p className="pb-1.5 text-sm font-semibold text-ink tabular-nums">
            {t("careers.jobs.count", { count: jobs.length })}
          </p>
        )}
      </header>

      {jobs.length > 0 ? (
        <section
          aria-label={t("careers.jobs.title")}
          className="site-container pt-10 md:pt-12"
        >
          <Reveal>
            <JobsTable jobs={jobs} showStageLegend />
          </Reveal>
        </section>
      ) : (
        <section
          aria-labelledby="jobs-empty-title"
          className="site-container pt-12 md:pt-16"
        >
          <Reveal className="relative isolate flex flex-col items-center gap-4.5 overflow-hidden rounded-card bg-brand-100 px-6 py-16 text-center md:py-24">
            <LogoMark className="absolute -right-30 -bottom-35 -z-10 w-130 text-brand/7" />
            <span className="flex size-18 items-center justify-center rounded-full bg-white text-brand shadow-[0_12px_30px_-18px_rgb(11_31_51/0.4)]">
              <BriefcaseBusiness className="size-7.5" strokeWidth={1.7} />
            </span>
            <h2
              id="jobs-empty-title"
              className="mt-1.5 font-display text-[clamp(28px,3.2vw,40px)] leading-[1.15] font-semibold text-balance text-ink"
            >
              {t("careers.jobs.emptyTitle")}
            </h2>
            <p className="max-w-135 text-[17px] leading-relaxed text-pretty text-ink-2">
              {t("careers.jobs.emptyText")}
              {facebookUrl && ` ${t("careers.jobs.followText")}`}
            </p>
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={siteButtonClass("primary", "mt-2 px-7 text-base")}
              >
                {t("careers.jobs.followButton")}
                <ArrowUpRight className="size-4.5" />
              </a>
            )}
            <Link
              href="/human-resources"
              className="text-[15px] font-medium text-brand-700 underline decoration-brand-300 underline-offset-4 transition-colors duration-150 hover:decoration-brand-700"
            >
              {t("careers.jobs.aboutTeam")}
            </Link>
          </Reveal>
        </section>
      )}
    </>
  );
}
