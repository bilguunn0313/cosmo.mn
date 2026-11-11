import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { NetworkMap } from "./network-map";

interface NetworkSectionProps {
  salesPoints: string | null;
}

export async function NetworkSection({ salesPoints }: NetworkSectionProps) {
  const t = await getTranslations("about.network");

  const points = [
    t("points.hub"),
    t("points.regions"),
    ...(salesPoints ? [t("points.salesPoints", { salesPoints })] : []),
    t("points.channels"),
    t("points.fulfillment"),
  ];

  return (
    <section
      aria-labelledby="network-title"
      className="site-container overflow-x-clip py-20 md:py-28"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-18">
        <Reveal from="left" className="flex flex-col gap-5.5">
          <SectionEyebrow>{t("eyebrow")}</SectionEyebrow>
          <h2
            id="network-title"
            className="type-section text-balance text-ink"
          >
            {t.rich("title", {
              highlight: (chunks) => (
                <span className="text-brand">{chunks}</span>
              ),
            })}
          </h2>
          <p className="text-[17px] leading-[1.75] text-pretty text-ink-2">
            {t("text")}
          </p>
          <ul className="mt-2">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-center gap-3.5 border-t border-rule py-4 font-medium text-ink last:border-b"
              >
                <span
                  aria-hidden
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-100"
                >
                  <Check className="size-4 text-brand" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal from="right">
          <NetworkMap />
        </Reveal>
      </div>
    </section>
  );
}
