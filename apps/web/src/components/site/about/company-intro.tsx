import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ImageReveal } from "@/components/site/image-reveal";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";

const INTRO_IMAGE = "/images/about/intro-containers.webp";

export async function CompanyIntro() {
  const t = await getTranslations("about.intro");

  return (
    <section
      aria-labelledby="intro-title"
      className="relative overflow-hidden pb-20 lg:py-30"
    >
      <div className="relative h-65 sm:h-90 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-1/2">
        <ImageReveal>
          <Image
            src={INTRO_IMAGE}
            alt={t("imageAlt")}
            fill
            unoptimized
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </ImageReveal>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-white to-white/0 to-50% lg:bg-linear-to-r lg:via-white/70 lg:via-22% lg:to-55%"
        />
      </div>

      <div className="site-container relative mt-8 lg:mt-0">
        <div className="flex max-w-150 flex-col gap-5.5">
          <Reveal>
            <SectionEyebrow>{t("label")}</SectionEyebrow>
          </Reveal>
          <Reveal index={1}>
            <h2
              id="intro-title"
              className="type-section text-balance text-ink"
            >
              {t.rich("title", {
                highlight: (chunks) => (
                  <span className="text-brand">{chunks}</span>
                ),
              })}
            </h2>
          </Reveal>
          <Reveal index={2}>
            <p className="text-lg leading-[1.65] text-pretty text-ink">
              {t("lead")}
            </p>
          </Reveal>
          <Reveal index={3}>
            <p className="text-[17px] leading-[1.75] text-pretty text-ink-2">
              {t("body1")}
            </p>
          </Reveal>
          <Reveal index={4}>
            <p className="text-[17px] leading-[1.75] text-pretty text-ink-2">
              {t("body2")}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
