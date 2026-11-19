import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CopyLinkButton } from "@/components/site/copy-link-button";
import { JobsTable } from "@/components/site/careers/jobs-table";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { siteButtonClass } from "@/components/site/site-button";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { daysLeft, formatJobDate } from "@/lib/job-dates";
import { fetchJob, fetchJobs } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";
import { JOBS_PATH, jobApplicationPath, jobPath } from "@/lib/site-links";

const MAX_OTHER_JOBS = 4;

interface JobFact {
  icon: LucideIcon;
  label: string;
  value: string;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/human-resources/jobs/[slug]">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const { slug } = await params;
  const t = await getTranslations({ locale });
  const job = await fetchJob(slug, locale);

  if (!job) {
    return {};
  }

  return pageMetadata({
    locale,
    path: jobPath(job.slug),
    title: job.title,
    description: job.summary ?? t("seo.jobsDescription"),
  });
}

export default async function JobPage({
  params,
}: PageProps<"/[locale]/human-resources/jobs/[slug]">) {
  const locale = await getPageLocale(params);
  const { slug } = await params;
  const t = await getTranslations();
  const [job, jobs] = await Promise.all([
    fetchJob(slug, locale),
    fetchJobs(locale),
  ]);

  if (!job) {
    notFound();
  }

  const otherJobs = jobs
    .filter((item) => item.slug !== job.slug)
    .slice(0, MAX_OTHER_JOBS);
  const isAcceptingApplications = job.stage !== "DECIDED";
  const remainingDays = job.closesAt
    ? daysLeft(job.closesAt, new Date())
    : null;

  const facts: JobFact[] = [
    ...(job.location
      ? [
          {
            icon: MapPin,
            label: t("careers.jobs.location"),
            value: job.location,
          },
        ]
      : []),
    {
      icon: Clock,
      label: t("careers.jobs.workType"),
      value: t(`careers.jobs.types.${job.employmentType}`),
    },
    {
      icon: Wallet,
      label: t("careers.jobs.salary"),
      value: job.salary ?? t("careers.jobs.salaryNegotiable"),
    },
    {
      icon: CalendarDays,
      label: t("careers.jobs.published"),
      value: formatJobDate(job.openedAt),
    },
  ];

  const lists = [
    { key: "duties", title: t("careers.jobs.duties"), items: job.duties },
    {
      key: "requirements",
      title: t("careers.jobs.requirements"),
      items: job.requirements,
    },
    { key: "offers", title: t("careers.jobs.offers"), items: job.offers },
  ].filter((list) => list.items.length > 0);

  return (
    <>
      <div className="site-container pt-6 md:pt-8">
        <Breadcrumbs
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("nav.careers"), href: "/human-resources" },
            { label: t("careers.jobs.title"), href: JOBS_PATH },
            { label: job.title },
          ]}
        />
      </div>

      <header className="site-container pt-10 md:pt-14">
        <Reveal className="grid max-w-230 gap-5">
          <SectionEyebrow>
            {t(`careers.departments.${job.department}`)}
          </SectionEyebrow>
          <h1 className="type-section text-balance text-ink">{job.title}</h1>
        </Reveal>

        <dl className="mt-10 grid grid-cols-2 border-t border-rule md:grid-cols-4 md:border-b">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="grid content-start gap-1.5 border-b border-rule py-5 pr-6 md:border-b-0 md:[&+&]:border-l md:[&+&]:pl-6"
            >
              <dt className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
                <fact.icon className="size-4 text-ink-3" />
                {fact.label}
              </dt>
              <dd className="text-[17px] font-medium text-ink tabular-nums">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="site-container grid gap-12 pt-12 md:pt-16 lg:grid-cols-12 lg:gap-x-6">
        <aside
          aria-label={t("careers.jobs.apply")}
          className="grid content-start gap-4.5 self-start rounded-card bg-white p-7 shadow-[0_0_0_1px_var(--color-brand-200),0_28px_56px_-40px_rgb(11_31_51/0.35)] lg:sticky lg:top-30 lg:col-span-4 lg:col-start-9 lg:row-start-1 md:p-8"
        >
          <div className="grid gap-1.5">
            <span className="text-[13px] font-medium text-ink-2">
              {t("careers.jobs.deadline")}
            </span>
            <span className="font-display text-3xl leading-[1.15] font-semibold text-ink tabular-nums">
              {job.closesAt
                ? formatJobDate(job.closesAt)
                : t("careers.jobs.alwaysOpen")}
            </span>
            {remainingDays !== null && (
              <span className="flex items-center gap-2 text-[15px] text-ink-2">
                <Clock className="size-4" />
                {remainingDays === 0
                  ? t("careers.jobs.lastDay")
                  : t("careers.jobs.daysLeft", { count: remainingDays })}
              </span>
            )}
          </div>

          {isAcceptingApplications ? (
            <>
              <Link
                href={jobApplicationPath(job.slug)}
                className={siteButtonClass(
                  "primary",
                  "mt-1 justify-center gap-2.5 text-base font-medium",
                )}
              >
                {t("careers.jobs.apply")}
                <ArrowRight className="size-4.5" />
              </Link>
              <p className="text-sm leading-relaxed text-ink-2">
                {t("careers.jobs.applyNote")}
              </p>
            </>
          ) : (
            <p className="rounded-control bg-paper px-4 py-3.5 text-sm leading-relaxed text-ink-2">
              {t("careers.jobs.closedNote")}
            </p>
          )}

          <div className="border-t border-rule pt-3">
            <CopyLinkButton
              label={t("careers.jobs.copyLink")}
              copiedLabel={t("careers.jobs.copied")}
            />
          </div>
        </aside>

        <div className="grid content-start gap-13 lg:col-span-7 lg:row-start-1">
          {job.summary && (
            <p className="text-xl leading-relaxed text-pretty text-ink">
              {job.summary}
            </p>
          )}
          {lists.map((list) => (
            <section key={list.key} aria-labelledby={`job-${list.key}`}>
              <h2
                id={`job-${list.key}`}
                className="type-h3 font-semibold text-ink"
              >
                {list.title}
              </h2>
              <ul className="mt-5 grid gap-3.5">
                {list.items.map((item) => (
                  <li
                    key={item}
                    className="relative pl-7.5 text-[17px] leading-relaxed text-pretty text-ink before:absolute before:top-[0.8em] before:left-0 before:h-0.5 before:w-3.5 before:rounded-full before:bg-coral"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {otherJobs.length > 0 && (
        <section
          aria-labelledby="other-jobs-title"
          className="site-container pt-24 md:pt-32"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2
              id="other-jobs-title"
              className="type-h3 font-semibold text-ink"
            >
              {t("careers.jobs.otherJobs")}
            </h2>
            <Link
              href={JOBS_PATH}
              className="group inline-flex items-center gap-2 text-[15px] font-medium text-brand-700"
            >
              {t("careers.jobs.allJobs")}
              <ArrowRight className="size-4 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-5">
            <JobsTable jobs={otherJobs} />
          </div>
        </section>
      )}
    </>
  );
}
