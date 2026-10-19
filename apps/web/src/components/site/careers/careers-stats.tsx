import { getTranslations } from "next-intl/server";
import { StatNumber } from "@/components/site/home/stat-number";
import { HR_FACTS } from "@/lib/hr-facts";
import { cn } from "@/lib/utils";

const CELL_CLASS =
  "flex flex-col gap-2 bg-paper py-8 sm:pr-6 sm:even:pl-6 lg:pl-6 lg:first:pl-0";

interface CareersStatsProps {
  employeeCount: number;
}

export async function CareersStats({ employeeCount }: CareersStatsProps) {
  const t = await getTranslations("careers");
  const menPercent = 100 - HR_FACTS.womenPercent;

  const numberStats = [
    {
      key: "employees",
      label: t("statEmployees"),
      value: employeeCount,
      fractionDigits: 0,
    },
    {
      key: "tenure",
      label: t("statTenure"),
      value: HR_FACTS.averageTenureYears,
      fractionDigits: 1,
    },
    {
      key: "age",
      label: t("statAge"),
      value: HR_FACTS.averageAge,
      fractionDigits: 1,
    },
  ];

  return (
    <section
      aria-label={t("statsLabel")}
      className="site-container mt-14 md:mt-20"
    >
      <dl className="grid gap-px border-y border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {numberStats.map((stat) => (
          <div key={stat.key} className={CELL_CLASS}>
            <dt className="order-2 text-[17px] text-ink-3">{stat.label}</dt>
            <dd className="order-1 type-stat text-brand">
              <StatNumber
                value={stat.value}
                fractionDigits={stat.fractionDigits}
              />
            </dd>
          </div>
        ))}

        <div className={cn(CELL_CLASS, "justify-end")}>
          <dt className="order-2 text-[17px] text-ink-3">{t("statGender")}</dt>
          <dd className="order-1 grid gap-3">
            <span className="flex justify-between text-[15px] font-semibold tabular-nums">
              <span className="text-brand">
                {t("women", { percent: HR_FACTS.womenPercent })}
              </span>
              <span>{t("men", { percent: menPercent })}</span>
            </span>
            <span aria-hidden className="flex h-7 bg-ink">
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
