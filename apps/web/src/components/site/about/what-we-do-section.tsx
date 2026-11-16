import { Grid2x2Check, Store, Truck, Warehouse } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SupplyChainIllustration } from "./supply-chain-illustration";

const STEPS = [
  { key: "warehouse", icon: Warehouse },
  { key: "inventory", icon: Grid2x2Check },
  { key: "distribution", icon: Truck },
  { key: "retail", icon: Store },
] as const;

export async function WhatWeDoSection() {
  const t = await getTranslations();

  return (
    <section
      aria-labelledby="what-we-do-title"
      className="supply-chain mt-20 bg-brand-100 py-20 md:mt-28 md:py-28"
    >
      <div className="site-container">
        <Reveal className="flex flex-col items-start gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex max-w-180 flex-col gap-4.5">
            <SectionEyebrow>{t("about.areasEyebrow")}</SectionEyebrow>
            <h2
              id="what-we-do-title"
              className="type-section text-balance text-ink"
            >
              {t("about.areasTitle")}
            </h2>
          </div>
          <p className="max-w-105 text-lg leading-relaxed text-pretty text-ink-2">
            {t("about.areasText")}
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="mt-12 rounded-card bg-white px-5 pt-8 pb-6 md:mt-14 md:px-10 md:pt-12 md:pb-10"
        >
          <SupplyChainIllustration
            label={t("about.areasIllustrationLabel")}
            storeSign={t("about.areasStoreSign")}
          />

          <ul className="mt-2 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-[310fr_275fr_285fr_250fr]">
            {STEPS.map((step) => (
              <li
                key={step.key}
                data-zone={step.key}
                className="supply-step flex flex-col gap-2 border-t-2 border-brand-100 pt-5.5 pb-1 transition-colors duration-250 hover:border-brand"
              >
                <step.icon
                  aria-hidden
                  className="size-6 text-brand"
                  strokeWidth={1.5}
                />
                <h3 className="type-h4 font-semibold text-ink">
                  {t(`about.logistics.items.${step.key}.title`)}
                </h3>
                <p className="text-[15px] leading-relaxed text-pretty text-ink-2">
                  {t(`about.logistics.items.${step.key}.text`)}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
