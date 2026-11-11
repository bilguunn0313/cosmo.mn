import { JOB_STAGES } from "@cosmo/shared";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { daysLeft, formatJobDate, isClosingSoon } from "@/lib/job-dates";
import type { PublicJob } from "@/lib/public-api";
import { jobPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import { JobStageMeter } from "./job-stage-meter";

const HEAD_CELL_CLASS =
  "h-13 bg-brand-100 px-5 text-left font-display text-[13px] font-semibold tracking-[0.02em] whitespace-nowrap text-brand-700";
const CELL_CLASS =
  "border-b border-rule px-5 py-6 align-middle transition-colors duration-200 group-hover:bg-brand-100/45 max-md:border-0 max-md:p-0 max-md:group-hover:bg-transparent";
const MOBILE_LABEL_CLASS = "text-ink-3 md:hidden";

interface JobsTableProps {
  jobs: PublicJob[];
  showStageLegend?: boolean;
}

export async function JobsTable({
  jobs,
  showStageLegend = false,
}: JobsTableProps) {
  const t = await getTranslations("careers");
  const now = new Date();

  return (
    <div>
      <table className="w-full border-separate border-spacing-0 tabular-nums max-md:block">
        <thead className="max-md:hidden">
          <tr>
            <th scope="col" className={cn(HEAD_CELL_CLASS, "rounded-l-xl")}>
              {t("jobs.columns.position")}
            </th>
            <th scope="col" className={cn(HEAD_CELL_CLASS, "w-62")}>
              {t("jobs.columns.stage")}
            </th>
            <th
              scope="col"
              className={cn(HEAD_CELL_CLASS, "w-56 rounded-r-xl")}
            >
              {t("jobs.columns.closes")}
            </th>
          </tr>
        </thead>
        <tbody className="max-md:block">
          {jobs.map((job) => {
            const meta = [
              t(`departments.${job.department}`),
              job.location,
              t(`jobs.types.${job.employmentType}`),
            ].filter(Boolean);
            const remainingDays = job.closesAt
              ? daysLeft(job.closesAt, now)
              : null;

            return (
              <tr
                key={job.slug}
                className="group relative has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-brand max-md:grid max-md:gap-y-2.5 max-md:border-b max-md:border-rule max-md:py-5.5"
              >
                <td className={CELL_CLASS}>
                  <Link
                    href={jobPath(job.slug)}
                    className="block font-display text-xl leading-[1.3] font-semibold tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-brand-700 after:absolute after:inset-0 focus-visible:outline-none"
                  >
                    {job.title}
                  </Link>
                  <span className="mt-1.5 block text-sm text-ink-2">
                    {meta.join(" · ")}
                  </span>
                </td>
                <td className={CELL_CLASS}>
                  <JobStageMeter
                    stage={job.stage}
                    label={t(`jobs.stages.${job.stage}`)}
                  />
                </td>
                <td
                  className={cn(
                    CELL_CLASS,
                    "max-md:flex max-md:gap-2 max-md:text-sm",
                  )}
                >
                  <span className={MOBILE_LABEL_CLASS}>
                    {t("jobs.columns.closes")}
                  </span>
                  <span className="grid gap-1">
                    {job.closesAt
                      ? t("jobs.until", { date: formatJobDate(job.closesAt) })
                      : t("jobs.alwaysOpen")}
                    {remainingDays !== null && (
                      <span
                        className={cn(
                          "flex items-center gap-1.75 text-[13px] text-ink-2",
                          isClosingSoon(remainingDays) &&
                            "before:size-1.75 before:rounded-full before:bg-coral",
                        )}
                      >
                        {remainingDays === 0
                          ? t("jobs.lastDay")
                          : t("jobs.daysLeft", { count: remainingDays })}
                      </span>
                    )}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showStageLegend && (
        <p className="mt-4 flex flex-wrap gap-x-5.5 gap-y-1.5 text-[13px] text-ink-3">
          <span className="font-semibold text-ink-2">
            {t("jobs.columns.stage")}:
          </span>
          {JOB_STAGES.map((stage, index) => (
            <span key={stage}>
              {index + 1}. {t(`jobs.stages.${stage}`)}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
