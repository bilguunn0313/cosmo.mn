import {
  ArrowRight,
  BriefcaseBusiness,
  LockKeyhole,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ApplicationForm } from "@/components/site/careers/application-form";
import { LogoMark } from "@/components/site/logo-mark";
import { requiredMarkClass } from "@/components/site/form-styles";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { siteButtonClass } from "@/components/site/site-button";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { daysLeft, formatJobDate } from "@/lib/job-dates";
import {
  fetchJob,
  fetchSiteSetting,
  type PublicJobDetail,
} from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";
import { APPLICATION_PATH, JOBS_PATH, phoneHref } from "@/lib/site-links";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/human-resources/anket">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale });

  return {
    ...pageMetadata({
      locale,
      path: APPLICATION_PATH,
      title: t("careers.form.eyebrow"),
      description: t("careers.form.intro"),
    }),
    robots: { index: false, follow: true },
  };
}

async function findOpenJob(
  jobSlug: unknown,
  locale: Parameters<typeof fetchJob>[1],
) {
  if (typeof jobSlug !== "string" || jobSlug === "") {
    return null;
  }

  const job = await fetchJob(jobSlug, locale);
  return job && job.stage !== "DECIDED" ? job : null;
}

interface JobSummaryCardProps {
  job: PublicJobDetail;
  contactPhone: string | null;
}

async function JobSummaryCard({ job, contactPhone }: JobSummaryCardProps) {
  const t = await getTranslations("careers");
  const remainingDays = job.closesAt
    ? daysLeft(job.closesAt, new Date())
    : null;

  return (
    <div className="grid gap-5 rounded-card bg-white p-6 shadow-[0_0_0_1px_var(--color-brand-200),0_28px_56px_-40px_rgb(11_31_51/0.35)] md:p-7">
      <div className="grid gap-1.5">
        <span className="text-[13px] font-medium text-ink-2">
          {t("jobs.deadline")}
        </span>
        <span className="font-display text-2xl leading-[1.2] font-semibold text-ink tabular-nums">
          {job.closesAt
            ? t("jobs.until", { date: formatJobDate(job.closesAt) })
            : t("jobs.alwaysOpen")}
        </span>
        {remainingDays !== null && (
          <span className="text-sm text-ink-2">
            {remainingDays === 0
              ? t("jobs.lastDay")
              : t("jobs.daysLeft", { count: remainingDays })}
          </span>
        )}
      </div>
      <ul className="grid gap-3.5 border-t border-rule pt-5 text-sm leading-relaxed text-ink-2">
        <li className="flex gap-3">
          <span
            aria-hidden
            className={`flex size-5 shrink-0 justify-center text-base font-semibold ${requiredMarkClass}`}
          >
            *
          </span>
          <span>
            <span className="sr-only">*</span>
            {t("form.noteRequired")}
          </span>
        </li>
        <li className="flex gap-3">
          <LockKeyhole
            aria-hidden
            className="mt-0.5 size-4.5 shrink-0 text-brand"
          />
          {t("form.notePrivacy")}
        </li>
        {contactPhone && (
          <li className="flex gap-3">
            <Phone
              aria-hidden
              className="mt-0.5 size-4.5 shrink-0 text-brand"
            />
            <span>
              {t("form.noteQuestions")}{" "}
              <a
                href={phoneHref(contactPhone)}
                className="font-medium whitespace-nowrap text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-700"
              >
                {contactPhone}
              </a>
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}

export default async function ApplicationPage({
  params,
  searchParams,
}: PageProps<"/[locale]/human-resources/anket">) {
  const locale = await getPageLocale(params);
  const { job: jobSlug } = await searchParams;
  const t = await getTranslations();
  const [job, setting] = await Promise.all([
    findOpenJob(jobSlug, locale),
    fetchSiteSetting(locale),
  ]);
  const contactPhone = setting?.phone ?? null;

  if (!job) {
    return (
      <>
        <section
          aria-labelledby="anket-unavailable-title"
          className="site-container pt-8 md:pt-14"
        >
          <div className="relative isolate flex flex-col items-center gap-4.5 overflow-hidden rounded-card bg-brand-100 px-6 py-16 text-center md:py-24">
            <LogoMark className="absolute -right-30 -bottom-35 -z-10 w-130 text-brand/7" />
            <span className="flex size-18 items-center justify-center rounded-full bg-white text-brand shadow-[0_12px_30px_-18px_rgb(11_31_51/0.4)]">
              <BriefcaseBusiness className="size-7.5" strokeWidth={1.7} />
            </span>
            <h1
              id="anket-unavailable-title"
              className="mt-1.5 font-display text-[clamp(28px,3.2vw,40px)] leading-[1.15] font-semibold text-balance text-ink"
            >
              {t("careers.form.unavailableTitle")}
            </h1>
            <p className="max-w-135 text-[17px] leading-relaxed text-pretty text-ink-2">
              {t("careers.form.unavailableText")}
            </p>
            <Link
              href={JOBS_PATH}
              className={siteButtonClass("primary", "mt-2 px-7 text-base")}
            >
              {t("careers.jobs.heroButton")}
              <ArrowRight className="size-4.5" />
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section
        aria-labelledby="application-title"
        className="site-container grid gap-10 pt-8 md:pt-14 lg:grid-cols-12 lg:gap-x-6"
      >
        <header className="grid gap-4 lg:col-span-8">
          <SectionEyebrow>{t("careers.form.eyebrow")}</SectionEyebrow>
          <h1
            id="application-title"
            className="type-section text-balance text-ink"
          >
            {job.title}
          </h1>
        </header>

        <aside
          aria-label={job.title}
          className="lg:sticky lg:top-30 lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:self-start"
        >
          <JobSummaryCard job={job} contactPhone={contactPhone} />
        </aside>

        <div className="max-w-215 lg:col-span-8">
          <ApplicationForm
            jobSlug={job.slug}
            jobTitle={job.title}
            contactPhone={contactPhone}
          />
        </div>
      </section>
    </>
  );
}
