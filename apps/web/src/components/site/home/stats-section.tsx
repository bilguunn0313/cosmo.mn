import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import type { PublicSiteSetting } from "@/lib/public-api";
import { StatNumber } from "./stat-number";

const YEARS_STEP = 10;

function roundedYearsSince(foundedYear: number) {
  const years = new Date().getFullYear() - foundedYear;
  return Math.floor(years / YEARS_STEP) * YEARS_STEP;
}

interface StatsSectionProps {
  setting: PublicSiteSetting | null;
}

export async function StatsSection({ setting }: StatsSectionProps) {
  const t = await getTranslations("home.stats");
  const foundedYear = setting?.foundedYear;

  const stats = [
    {
      key: "years",
      value: foundedYear ? roundedYearsSince(foundedYear) : null,
    },
    { key: "products", value: setting?.productCount ?? null },
    { key: "salesPoints", value: setting?.salesPointCount ?? null },
    { key: "team", value: setting?.employeeCount ?? null },
  ] as const;

  const visibleStats = stats.filter((stat) => stat.value);

  if (visibleStats.length === 0) {
    return null;
  }

  return (
    <section aria-label={t("label")} className="bg-white py-8 md:py-12">
      <ul className="site-container grid grid-cols-2 gap-3 md:gap-4 lg:auto-cols-fr lg:grid-flow-col">
        {visibleStats.map((stat, index) => (
          <li key={stat.key}>
            <Reveal
              index={index}
              className="flex h-full flex-col gap-2.5 rounded-card bg-brand-100 px-5 py-7 text-center"
            >
              <span className="type-stat text-brand">
                <StatNumber value={stat.value ?? 0} />
                <span className="ml-0.5 align-top text-[0.5em] leading-none">
                  +
                </span>
                {stat.key === "years" && (
                  <span className="text-[0.42em] font-semibold">
                    {" "}
                    {t("yearsUnit")}
                  </span>
                )}
              </span>
              <span className="text-[15px] text-ink-2">{t(stat.key)}</span>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
