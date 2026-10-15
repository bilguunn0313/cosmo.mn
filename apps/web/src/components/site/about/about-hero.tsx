import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";

export async function AboutHero() {
  const t = await getTranslations();

  return (
    <section className="relative flex h-[calc(100svh-4rem)] min-h-155 items-end overflow-hidden bg-brand-night lg:h-[calc(100svh-5.25rem)]">
      <div className="site-container">
        <Reveal
          delay={0.3}
          className="relative grid max-w-215 gap-5 bg-paper pt-10 pr-6 pb-11 before:absolute before:inset-y-0 before:right-full before:w-screen before:bg-paper md:pr-12"
        >
          <p className="eyebrow text-ink-3">{t("nav.about")}</p>
          <h1 className="text-[clamp(56px,7.5vw,120px)] leading-[0.9] font-semibold tracking-[-0.055em]">
            {t("about.heroTitle")}
          </h1>
          <p className="max-w-155 text-[clamp(19px,1.6vw,24px)] leading-[1.35] font-semibold text-pretty">
            {t("about.description")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
