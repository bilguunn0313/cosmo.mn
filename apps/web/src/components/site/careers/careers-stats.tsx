import { getTranslations } from "next-intl/server";
import { StatNumber } from "@/components/site/home/stat-number";
import { HR_FACTS } from "@/lib/hr-facts";
import { cn } from "@/lib/utils";

const CELL_CLASS =
  "flex flex-col gap-2 rounded-card bg-surface px-6 py-7 md:px-8 md:py-9";

interface CareersStatsProps {
  employeeCount: number;
}

export async function CareersStats({ employeeCount }: CareersStatsProps) {
  const t = await getTranslations("careers");
  const menPercent = 100 - HR_FACTS.womenPercent;

  return (
    <section
      aria-label={t("statsLabel")}
      className="site-container mt-14 md:mt-20"
    >
      <dl className="grid gap-3 sm:grid-cols-2">
        <div className={CELL_CLASS}>
          <dt className="order-2 text-base text-ink-3">{t("statEmployees")}</dt>
          <dd className="order-1 type-stat text-brand">
            <StatNumber value={employeeCount} fractionDigits={0} />
          </dd>
        </div>

        <div className={cn(CELL_CLASS, "justify-end")}>
          <dt className="order-2 text-base text-ink-3">{t("statGender")}</dt>
          <dd className="order-1 grid gap-3">
            <span className="flex justify-between text-sm font-semibold tabular-nums">
              <span className="text-brand">
                {t("women", { percent: HR_FACTS.womenPercent })}
              </span>
              <span>{t("men", { percent: menPercent })}</span>
            </span>
            <span
              aria-hidden
              className="flex h-7 overflow-hidden rounded-control bg-ink"
            >
              <span
                className="h-full bg-brand"
                style={{ width: `${HR_FACTS.womenPercent}%` }}
              />
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
