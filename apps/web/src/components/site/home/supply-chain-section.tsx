import { Grid2x2Check, Store, Truck, Warehouse } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { SupplyChainIllustration } from "./supply-chain-illustration";

const STEPS = [
  { key: "warehouse", icon: Warehouse },
  { key: "inventory", icon: Grid2x2Check },
  { key: "distribution", icon: Truck },
  { key: "retail", icon: Store },
] as const;

export async function SupplyChainSection() {
  const t = await getTranslations("home.supplyChain");

  return (
    <section
      aria-labelledby="supply-chain-title"
      className="supply-chain bg-white pt-20 md:pt-28"
    >
      <div className="site-container">
        <Reveal>
          <h2
            id="supply-chain-title"
            className="type-section text-balance text-ink"
          >
            {t("title")}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 md:mt-14">
          <SupplyChainIllustration
            label={t("illustrationLabel")}
            storeSign={t("storeSign")}
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
                  {t(`items.${step.key}.title`)}
                </h3>
                <p className="text-[15px] leading-relaxed text-pretty text-ink-2">
                  {t(`items.${step.key}.text`)}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
