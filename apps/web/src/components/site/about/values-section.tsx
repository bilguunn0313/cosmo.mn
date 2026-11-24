import { getTranslations } from "next-intl/server";
import {
  HandHeartIcon,
  QualityIcon,
  SustainabilityIcon,
  TeamIcon,
} from "@/components/site/brand-icons";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";

const VALUES = [
  { key: "people", icon: TeamIcon },
  { key: "satisfaction", icon: HandHeartIcon },
  { key: "quality", icon: QualityIcon },
  { key: "responsibility", icon: SustainabilityIcon },
] as const;

export async function ValuesSection() {
  const t = await getTranslations("about");

  return (
    <section
      aria-labelledby="values-title"
      className="bg-brand-100 py-16 md:py-22"
    >
      <div className="site-container">
        <Reveal className="flex justify-center">
          <SectionEyebrow
            as="h2"
            id="values-title"
            className="text-base md:text-lg"
          >
            {t("values.eyebrow")}
          </SectionEyebrow>
        </Reveal>
        <ul className="mt-7 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-6">
          {VALUES.map((value, index) => (
            <li key={value.key}>
              <Reveal index={index} className="h-full">
                <article className="group relative flex h-full flex-col gap-4 rounded-card bg-white px-5.5 pt-7 pb-7.5 transition-[translate,box-shadow] duration-350 ease-(--ease-out) hover:-translate-y-1 hover:shadow-[0_28px_48px_-30px_rgb(19_54_89/0.45)] motion-reduce:transition-none md:gap-5 md:px-10 md:pt-10 md:pb-11">
                  <span
                    aria-hidden
                    className="absolute top-0 left-5.5 h-0.75 w-10 rounded-b-[3px] bg-coral transition-[width] duration-500 ease-(--ease-out) group-hover:w-[calc(100%-5rem)] motion-reduce:transition-none md:left-10"
                  />
                  <div className="flex items-center gap-4 md:gap-5">
                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-brand-100 md:size-18 [&_svg]:size-8 md:[&_svg]:size-10">
                      <value.icon />
                    </span>
                    <h3 className="type-h3 font-semibold text-brand">
                      {t(`values.items.${value.key}.title`)}
                    </h3>
                  </div>
                  <p className="text-base leading-[1.7] text-ink-2 md:text-[17px]">
                    {t(`values.items.${value.key}.text`)}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
