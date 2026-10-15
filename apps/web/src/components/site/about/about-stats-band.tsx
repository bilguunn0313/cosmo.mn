import { getTranslations } from "next-intl/server";
import { getStats } from "@/components/site/home/get-stats";
import { StatNumber } from "@/components/site/home/stat-number";
import type { PublicBrand, PublicSiteSetting } from "@/lib/public-api";

interface AboutStatsBandProps {
  setting: PublicSiteSetting | null;
  brands: PublicBrand[];
}

export async function AboutStatsBand({ setting, brands }: AboutStatsBandProps) {
  const t = await getTranslations("home");
  const stats = await getStats(setting, brands);

  if (stats.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={t("statsTitle")}
      className="mt-20 bg-brand text-white md:mt-32"
    >
      <dl className="site-container grid lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="flex flex-col gap-2.5 border-white/40 py-10 not-first:border-t-2 lg:px-6 lg:py-14 lg:not-first:border-t-0 lg:not-first:border-l-2 lg:first:pl-0"
          >
            <dt className="order-2 text-[17px]">{stat.label}</dt>
            <dd className="order-1 text-[clamp(56px,7vw,112px)] leading-none font-semibold tracking-[-0.05em] tabular-nums">
              <StatNumber value={stat.value} suffix={stat.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
