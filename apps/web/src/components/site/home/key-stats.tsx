import { getTranslations } from "next-intl/server";
import {
  BrandsIcon,
  DistributionIcon,
  GrowthIcon,
  TeamIcon,
} from "@/components/site/brand-icons";
import { Reveal } from "@/components/site/reveal";
import type { PublicSiteSetting } from "@/lib/public-api";
import { StatNumber } from "./stat-number";

interface KeyStat {
  key: "founded" | "products" | "salesPoints" | "team";
  value: number | null;
  suffix: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

function yearsSince(year: number | null | undefined) {
  if (!year) {
    return null;
  }

  return new Date().getFullYear() - year;
}

interface KeyStatsProps {
  setting: PublicSiteSetting | null;
}

export async function KeyStats({ setting }: KeyStatsProps) {
  const t = await getTranslations("home");

  const stats: KeyStat[] = [
    {
      key: "founded",
      value: yearsSince(setting?.foundedYear),
      suffix: t("keyStats.founded.suffix"),
      icon: GrowthIcon,
    },
    {
      key: "products",
      value: setting?.productCount ?? null,
      suffix: "+",
      icon: BrandsIcon,
    },
    {
      key: "salesPoints",
      value: setting?.salesPointCount ?? null,
      suffix: "+",
      icon: DistributionIcon,
    },
    {
      key: "team",
      value: setting?.employeeCount ?? null,
      suffix: "+",
      icon: TeamIcon,
    },
  ];
  const shownStats = stats.filter((stat) => stat.value !== null);

  if (shownStats.length === 0) {
    return null;
  }

  return (
    <section aria-label={t("statsTitle")} className="bg-brand-100">
      <ul className="site-container grid grid-cols-2 gap-x-4 gap-y-8 py-9 md:py-14 lg:grid-cols-4">
        {shownStats.map((stat, index) => (
          <li key={stat.key}>
            <Reveal index={index} className="flex items-center gap-3 md:gap-4">
              <stat.icon className="h-9 w-auto shrink-0 md:h-11" />
              <div className="flex flex-col gap-1.5">
                <p className="font-display text-[11px] font-semibold tracking-[0.12em] text-ink-2 uppercase md:text-xs">
                  {t(`keyStats.${stat.key}.label`)}
                </p>
                <p className="font-display text-[22px] leading-none font-semibold tracking-[-0.02em] text-brand md:text-[28px]">
                  <StatNumber value={stat.value ?? 0} suffix={stat.suffix} />
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
