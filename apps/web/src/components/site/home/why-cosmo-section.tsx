import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import type { HomeStats } from "@/lib/home-stats";
import { DeliveryTruck } from "./delivery-truck";

interface WhyCosmoSectionProps {
  stats: HomeStats;
}

export async function WhyCosmoSection({ stats }: WhyCosmoSectionProps) {
  const t = await getTranslations("home.why");
  const { foundedYear, salesPoints, products } = stats;

  const reasons = [
    {
      key: "experience",
      title: t("reasons.experience.title"),
      text: foundedYear
        ? t("reasons.experience.text", { foundedYear })
        : t("reasons.experience.textPlain"),
    },
    {
      key: "brands",
      title: t("reasons.brands.title"),
      text: products
        ? t("reasons.brands.text", { products })
        : t("reasons.brands.textPlain"),
    },
    {
      key: "network",
      title: t("reasons.network.title"),
      text: salesPoints
        ? t("reasons.network.text", { salesPoints })
        : t("reasons.network.textPlain"),
    },
    {
      key: "products",
      title: t("reasons.products.title"),
      text: t("reasons.products.text"),
    },
  ];

  return (
    <section
      aria-labelledby="why-title"
      className="relative overflow-hidden bg-white pt-20 pb-20 lg:pt-30 lg:pb-32"
    >
      <div className="site-container grid gap-10 lg:grid-cols-[5fr_6fr] lg:grid-rows-[auto_1fr] lg:gap-x-24 lg:gap-y-0">
        <Reveal className="flex max-w-130 flex-col gap-6 lg:col-start-1 lg:row-start-1">
          <SectionEyebrow>{t("eyebrow")}</SectionEyebrow>
          <h2 id="why-title" className="type-section text-balance text-ink">
            {t("title")}
          </h2>
          <p className="text-lg leading-[1.65] text-pretty text-even text-ink-2">
            {t("text")}
          </p>
        </Reveal>

        <ol className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {reasons.map((reason, index) => (
            <li
              key={reason.key}
              className="border-b border-rule py-6 first:pt-1 md:py-8 md:first:pt-1"
            >
              <Reveal
                from="right"
                index={index}
                className="grid grid-cols-[44px_1fr] gap-2 md:grid-cols-[64px_1fr]"
              >
                <span
                  aria-hidden
                  className="font-display text-[38px] leading-none font-normal tracking-[-0.02em] text-brand tabular-nums md:text-[52px]"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="mt-1 mb-2.5 type-h4 font-semibold text-ink">
                    {reason.title}
                  </h3>
                  <p className="text-base leading-relaxed text-pretty text-ink-2">
                    {reason.text}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal
          from="left"
          className="lg:col-start-1 lg:row-start-2 lg:self-end"
        >
          <svg
            viewBox="440 200 480 170"
            aria-hidden
            className="block h-auto w-full max-w-130 [mask-image:linear-gradient(90deg,transparent,black_30%,black_90%,transparent)]"
          >
            <rect
              className="fill-brand-100"
              x="440"
              y="342"
              width="480"
              height="22"
            />
            <line
              className="supply-dash stroke-white"
              x1="440"
              y1="353"
              x2="920"
              y2="353"
              strokeWidth="3"
              strokeDasharray="16 14"
            />
            <g
              className="stroke-brand-300"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <line
                className="supply-whoosh"
                x1="560"
                y1="240"
                x2="586"
                y2="240"
              />
              <line
                className="supply-whoosh"
                x1="548"
                y1="264"
                x2="584"
                y2="264"
              />
              <line
                className="supply-whoosh"
                x1="562"
                y1="288"
                x2="588"
                y2="288"
              />
            </g>
            <DeliveryTruck />
          </svg>
        </Reveal>
      </div>
    </section>
  );
}
