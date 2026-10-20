import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { Link } from "@/i18n/navigation";
import type { PublicBrand, PublicSiteSetting } from "@/lib/public-api";
import { getStats } from "./get-stats";
import { StatNumber } from "./stat-number";

interface AboutIntroSectionProps {
  setting: PublicSiteSetting | null;
  brands: PublicBrand[];
}

export async function AboutIntroSection({
  setting,
  brands,
}: AboutIntroSectionProps) {
  const t = await getTranslations();
  const stats = await getStats(setting, brands);

  return (
    <section
      aria-labelledby="about-intro-title"
      className="site-container grid gap-y-14 py-20 md:py-32 lg:grid-cols-12 lg:gap-x-6"
    >
      <Reveal className="grid content-start justify-items-start gap-8 lg:col-span-6">
        <p className="eyebrow text-ink-3">{t("nav.about")}</p>
        <h2 id="about-intro-title" className="type-h2 text-balance">
          {t("home.aboutTitle")}
        </h2>
        <p className="max-w-150 text-base text-pretty text-ink-2">
          {t("home.aboutText")}
        </p>
        <Link
          href="/about"
          className={siteButtonClass("secondary", "min-w-55")}
        >
          {t("about.historyTitle")}
          <ArrowRight className="size-4.5" />
        </Link>
      </Reveal>

      {stats.length > 0 && (
        <dl className="grid gap-3 lg:col-span-5 lg:col-start-8">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.key}
              index={index}
              className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-6 gap-y-1 bg-surface px-6 py-7 transition-colors duration-200 ease-out hover:bg-brand md:px-8 md:py-9"
            >
              <stat.icon
                aria-hidden
                className="row-span-2 size-12 text-brand transition-colors duration-200 ease-out group-hover:text-white md:size-14"
                strokeWidth={1.25}
              />
              <dt className="col-start-2 row-start-2 text-[13px] font-semibold tracking-[0.06em] text-ink-3 uppercase transition-colors duration-200 ease-out group-hover:text-white/85">
                {stat.label}
              </dt>
              <dd className="col-start-2 row-start-1 type-stat text-ink transition-colors duration-200 ease-out group-hover:text-white">
                <StatNumber value={stat.value} suffix={stat.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      )}
    </section>
  );
}
