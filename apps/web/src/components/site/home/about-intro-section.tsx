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
      <Reveal className="grid content-start justify-items-start gap-8 lg:col-span-7">
        <p className="eyebrow text-ink-3">{t("nav.about")}</p>
        <h2
          id="about-intro-title"
          className="text-[clamp(48px,5.8vw,84px)] leading-[0.96] font-semibold tracking-[-0.045em] text-balance"
        >
          {t("home.aboutTitle")}
        </h2>
        <p className="max-w-150 text-lg text-pretty text-ink-2 md:text-xl md:leading-normal">
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
        <dl className="self-end border-b border-rule lg:col-span-4 lg:col-start-9">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.key}
              index={index}
              className="flex flex-col gap-1.5 border-t border-rule pt-5 pb-6"
            >
              <dt className="order-2 text-base text-ink-3">{stat.label}</dt>
              <dd className="order-1 text-[clamp(56px,5vw,72px)] leading-none font-semibold tracking-[-0.05em] text-brand tabular-nums">
                <StatNumber value={stat.value} suffix={stat.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      )}
    </section>
  );
}
