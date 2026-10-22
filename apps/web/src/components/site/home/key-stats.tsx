import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import type { PublicBrand, PublicSiteSetting } from "@/lib/public-api";
import { getStats } from "./get-stats";
import { StatNumber } from "./stat-number";

interface KeyStatsProps {
  setting: PublicSiteSetting | null;
  brands: PublicBrand[];
}

export async function KeyStats({ setting, brands }: KeyStatsProps) {
  const t = await getTranslations("home");
  const stats = await getStats(setting, brands);

  if (stats.length === 0) {
    return null;
  }

  return (
    <section aria-label={t("statsTitle")} className="bg-brand-100">
      <ul className="site-container grid grid-cols-2 gap-x-4 gap-y-8 py-9 md:py-14 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <li key={stat.key}>
            <Reveal index={index} className="flex items-center gap-3 md:gap-4">
              <stat.icon className="h-9 w-auto shrink-0 md:h-11" />
              <div className="flex flex-col gap-1.5">
                <p className="font-display text-[11px] font-semibold tracking-[0.12em] text-ink-2 uppercase md:text-xs">
                  {stat.label}
                </p>
                <p className="font-display text-[22px] leading-none font-semibold tracking-[-0.02em] text-brand md:text-[28px]">
                  <StatNumber value={stat.value} suffix={stat.suffix} />
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
