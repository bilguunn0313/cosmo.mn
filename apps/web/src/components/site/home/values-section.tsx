import { getTranslations } from "next-intl/server";
import { ImageReveal } from "@/components/site/image-reveal";
import { Reveal } from "@/components/site/reveal";
import { VALUE_KEYS } from "@/lib/about";
import { cn } from "@/lib/utils";

export async function ValuesSection() {
  const t = await getTranslations();

  return (
    <section aria-labelledby="values-title" className="pt-20 md:pt-32">
      <h2
        id="values-title"
        className="site-container pb-10 text-[clamp(48px,5.8vw,84px)] leading-[0.96] font-semibold tracking-[-0.045em] md:pb-16"
      >
        {t("home.valuesTitle")}
      </h2>

      <ol className="site-container grid gap-16 md:gap-28">
        {VALUE_KEYS.map((key, index) => {
          const isTextFirst = index % 2 === 1;

          return (
            <li
              key={key}
              className="grid gap-6 md:grid-cols-12 md:items-center md:gap-x-12"
            >
              <div
                className={cn(
                  "relative h-[clamp(280px,46vw,680px)] overflow-hidden md:col-span-7",
                  isTextFirst && "md:order-2",
                )}
              >
                <ImageReveal>
                  <div className="absolute inset-0 bg-surface" />
                </ImageReveal>
              </div>
              <Reveal delay={0.2} className="grid gap-4 md:col-span-5">
                <h3 className="text-[clamp(32px,3.9vw,56px)] leading-none font-semibold tracking-[0.01em] text-balance uppercase">
                  {t(`home.values.${key}.title`)}
                </h3>
                <p className="max-w-130 text-lg text-pretty text-ink-2 md:text-[21px] md:leading-normal">
                  {t(`home.values.${key}.text`)}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
