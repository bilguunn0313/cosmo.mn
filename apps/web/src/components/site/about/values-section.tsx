import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { ValuesArt } from "./values-art";

const VALUE_KEYS = [
  "people",
  "satisfaction",
  "quality",
  "responsibility",
] as const;

export async function ValuesSection() {
  const t = await getTranslations("about");

  return (
    <section
      aria-labelledby="values-title"
      className="values-block bg-brand-100 py-16 md:py-18"
    >
      <div className="site-container">
        <Reveal className="flex justify-center">
          <SectionEyebrow as="h2" id="values-title">
            {t("values.eyebrow")}
          </SectionEyebrow>
        </Reveal>
        <div className="mt-8 grid items-center gap-6 md:mt-12 lg:grid-cols-[6fr_5fr] lg:gap-16">
          <Reveal delay={0.1}>
            <ValuesArt label={t("values.art")} />
          </Reveal>
          <Reveal delay={0.2}>
            <dl className="flex flex-col gap-1">
              {VALUE_KEYS.map((key) => (
                <div
                  key={key}
                  data-value={key}
                  className="values-item rounded-[18px] py-3 md:px-5.5 md:py-4"
                >
                  <dt className="type-h4 font-semibold text-brand">
                    {t(`values.items.${key}.title`)}
                  </dt>
                  <dd className="mt-1.5 text-base leading-[1.65] text-pretty text-ink-2 sm:text-justify md:text-[17px]">
                    {t(`values.items.${key}.text`)}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
