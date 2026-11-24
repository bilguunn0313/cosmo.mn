import {
  Grid2x2Check,
  Store,
  TrainFront,
  Truck,
  Warehouse,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { SupplyChainIllustration } from "./supply-chain-illustration";

const STEPS = [
  { key: "import", icon: TrainFront },
  { key: "warehouse", icon: Warehouse },
  { key: "inventory", icon: Grid2x2Check },
  { key: "distribution", icon: Truck },
  { key: "retail", icon: Store },
] as const;

const BASE_COLUMN_WIDTH = 10;

export async function SupplyChainSection() {
  const t = await getTranslations("home.supplyChain");

  const steps = STEPS.map((step) => ({
    ...step,
    title: t(`items.${step.key}.title`),
    text: t(`items.${step.key}.text`),
  }));

  const balancedColumns = steps
    .map((step) => `minmax(0,${step.text.length + BASE_COLUMN_WIDTH}fr)`)
    .join(" ");

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
          <div className="max-sm:-mx-4 max-sm:overflow-x-auto max-sm:px-4">
            <SupplyChainIllustration
              label={t("illustrationLabel")}
              storeSign={t("storeSign")}
            />
          </div>

          <ul
            style={{ "--supply-columns": balancedColumns } as React.CSSProperties}
            className="mt-3 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-(--supply-columns)"
          >
            {steps.map((step) => (
              <li
                key={step.key}
                data-zone={step.key}
                className="supply-step group relative row-span-3 grid grid-rows-subgrid gap-3 pb-1"
              >
                <span
                  aria-hidden
                  className="absolute top-5.25 right-0 left-0 h-0.5 bg-brand-100 xl:-right-6 xl:group-last:right-0"
                >
                  <span className="absolute inset-0 origin-left scale-x-0 bg-brand transition-[scale] duration-350 ease-(--ease-out) group-hover:scale-x-100 motion-reduce:transition-none" />
                </span>
                <span className="relative grid size-11 place-items-center rounded-full bg-white shadow-[inset_0_0_0_2px_var(--color-brand-200)] transition-shadow duration-250 group-hover:shadow-[inset_0_0_0_2px_var(--color-brand)]">
                  <step.icon
                    aria-hidden
                    className="size-6 text-brand"
                    strokeWidth={1.5}
                  />
                </span>
                <h3 className="mt-1.5 type-h4 font-semibold text-balance text-ink">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-balance text-ink-2">
                  {step.text}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
