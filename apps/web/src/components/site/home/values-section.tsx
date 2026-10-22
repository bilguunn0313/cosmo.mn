import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import {
  VALUE_IMAGE_PLACEHOLDERS,
  VALUE_KEYS,
  type ValueKey,
} from "@/lib/about";
import { ValuesAccordion } from "./values-accordion";

interface ValuesSectionProps {
  images: Record<ValueKey, string | null> | undefined;
}

export async function ValuesSection({ images }: ValuesSectionProps) {
  const t = await getTranslations("home.values");
  const tHome = await getTranslations("home");

  const values = VALUE_KEYS.map((key) => ({
    key,
    title: t(`${key}.title`),
    text: t(`${key}.text`),
    imageUrl: images?.[key] ?? VALUE_IMAGE_PLACEHOLDERS[key],
  }));

  return (
    <section
      aria-labelledby="values-title"
      className="site-container pt-20 md:pt-32"
    >
      <h2 id="values-title" className="pb-5 type-h2 md:pb-6">
        {tHome("valuesTitle")}
      </h2>
      <Reveal>
        <ValuesAccordion values={values} />
      </Reveal>
    </section>
  );
}
