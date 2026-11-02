import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import type { HomeStats } from "@/lib/home-stats";

const PRODUCTS_IMAGE = "/images/home/why-products.webp";

interface WhyCosmoSectionProps {
  stats: HomeStats;
}

export async function WhyCosmoSection({ stats }: WhyCosmoSectionProps) {
  const t = await getTranslations("home.why");
  const { foundedYear, years, salesPoints, products, team } = stats;
  const hasExperienceNumbers = foundedYear && years && products;

  const reasons = [
    {
      key: "network",
      title: t("reasons.network.title"),
      text: salesPoints
        ? t("reasons.network.text", { salesPoints })
        : t("reasons.network.textPlain"),
    },
    {
      key: "oneStop",
      title: t("reasons.oneStop.title"),
      text: t("reasons.oneStop.text"),
    },
    {
      key: "experience",
      title: hasExperienceNumbers
        ? t("reasons.experience.title", { years })
        : t("reasons.experience.titlePlain"),
      text: hasExperienceNumbers
        ? t("reasons.experience.text", { foundedYear, products })
        : t("reasons.experience.textPlain"),
    },
    {
      key: "marketing",
      title: t("reasons.marketing.title"),
      text: team
        ? t("reasons.marketing.text", { team })
        : t("reasons.marketing.textPlain"),
    },
  ];

  return (
    <section
      aria-labelledby="why-title"
      className="relative overflow-hidden bg-white pt-20 lg:pt-30 lg:pb-32"
    >
      <div className="site-container grid gap-10 lg:grid-cols-[5fr_6fr] lg:grid-rows-[auto_1fr] lg:gap-x-24 lg:gap-y-0">
        <div className="flex max-w-130 flex-col gap-6 lg:col-start-1 lg:row-start-1">
          <SectionEyebrow>{t("eyebrow")}</SectionEyebrow>
          <h2 id="why-title" className="type-section text-balance text-ink">
            {t("title")}
          </h2>
          <p className="text-lg leading-[1.65] text-pretty text-ink-2">
            {t("text")}
          </p>
        </div>

        <ol className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {reasons.map((reason, index) => (
            <li
              key={reason.key}
              className="grid grid-cols-[60px_1fr] gap-2 border-b border-rule py-6 first:pt-1 md:grid-cols-[88px_1fr] md:py-8 md:first:pt-1"
            >
              <span
                aria-hidden
                className="font-display text-[38px] leading-none font-normal tracking-[-0.02em] text-brand tabular-nums md:text-[52px]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="mt-1 mb-2.5 font-display text-[21px] leading-[1.3] font-semibold text-ink">
                  {reason.title}
                </h3>
                <p className="text-base leading-relaxed text-pretty text-ink-2">
                  {reason.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <Image
          src={PRODUCTS_IMAGE}
          alt={t("imageAlt")}
          width={604}
          height={836}
          unoptimized
          className="mt-2 -mb-18 -ml-7 w-60 lg:col-start-1 lg:row-start-2 lg:-mb-67 lg:mt-0 lg:-ml-15 lg:w-102 lg:self-end"
        />
      </div>
    </section>
  );
}
