import { getTranslations } from "next-intl/server";
import { VALUE_KEYS } from "@/components/site/home/values-section";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";

export async function ValuesGrid() {
  const t = await getTranslations();

  return (
    <section
      aria-labelledby="values-title"
      className="site-container pt-20 md:pt-36"
    >
      <SectionHeader
        id="values-title"
        title={t("home.valuesTitle")}
        link={{ href: "/human-resources", label: t("nav.careers") }}
      />

      <ol className="grid border-b-2 border-rule lg:grid-cols-4">
        {VALUE_KEYS.map((key, index) => (
          <li
            key={key}
            className="border-rule not-first:border-t-2 lg:px-6 lg:not-first:border-t-0 lg:not-first:border-l-2 lg:first:pl-0 lg:last:pr-0"
          >
            <Reveal
              index={index}
              className="flex flex-col gap-3.5 pt-8 pb-10"
            >
              <span className="text-sm font-semibold text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] uppercase">
                {t(`home.values.${key}.title`)}
              </h3>
              <p className="text-base text-pretty text-ink-2">
                {t(`home.values.${key}.text`)}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
