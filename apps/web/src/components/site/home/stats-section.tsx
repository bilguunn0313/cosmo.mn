import { getLocale, getTranslations } from "next-intl/server";
import {
  BrandsIcon,
  DistributionIcon,
  GrowthIcon,
  NetworkIcon,
} from "@/components/site/brand-icons";
import { Reveal } from "@/components/site/reveal";
import type { PublicSiteSetting } from "@/lib/public-api";
import { StatOdometer } from "./stat-odometer";

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
  const locale = await getLocale();
  const foundedYear = setting?.foundedYear;

  const stats = [
    {
      key: "years",
      icon: GrowthIcon,
      value: foundedYear ? roundedYearsSince(foundedYear) : null,
    },
    {
      key: "products",
      icon: BrandsIcon,
      value: setting?.productCount ?? null,
    },
    {
      key: "salesPoints",
      icon: DistributionIcon,
      value: setting?.salesPointCount ?? null,
    },
    { key: "team", icon: NetworkIcon, value: setting?.employeeCount ?? null },
  ] as const;

  const visibleStats = stats.filter((stat) => stat.value);

  if (visibleStats.length === 0) {
    return null;
  }

  return (
    <section aria-label={t("label")} className="bg-white py-9 md:py-14">
      <ul className="site-container grid grid-cols-2 gap-y-8 lg:auto-cols-fr lg:grid-flow-col">
        {visibleStats.map((stat, index) => (
          <li
            key={stat.key}
            className="border-rule max-lg:even:border-l max-lg:even:pl-5 lg:pr-8 lg:not-first:border-l lg:not-first:pl-8"
          >
            <Reveal index={index} className="flex flex-col gap-3 md:gap-4">
              <StatOdometer
                value={stat.value ?? 0}
                locale={locale}
                unit={stat.key === "years" ? t("yearsUnit") : undefined}
              />
              <span className="flex items-start gap-2 text-[13px] leading-snug font-medium text-ink-2 md:items-center md:gap-2.5 md:text-[15px]">
                <stat.icon className="h-4.5 w-5 shrink-0 md:h-5.5 md:w-6.5" />
                {t(stat.key)}
              </span>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
