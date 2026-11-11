import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { ABOUT_CONTENT } from "@/lib/about";

export async function CeoMessage() {
  const t = await getTranslations("about.ceo");
  const photoUrl = ABOUT_CONTENT.ceoPhotoUrl;

  return (
    <section aria-labelledby="ceo-title" className="py-20 md:py-30">
      <div className="site-container grid items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-22">
        <Reveal
          from="left"
          className="relative aspect-4/5 w-full max-w-90 overflow-hidden rounded-card bg-linear-160 from-brand to-brand-700 lg:max-w-none"
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={t("name")}
              fill
              unoptimized
              sizes="(min-width: 1024px) 40vw, 360px"
              className="object-cover"
            />
          ) : (
            <LogoMark className="absolute inset-0 m-auto w-[38%] text-white/14" />
          )}
        </Reveal>

        <Reveal from="right" delay={0.09} className="flex flex-col gap-6">
          <SectionEyebrow as="h2" id="ceo-title">
            {t("title")}
          </SectionEyebrow>
          <span
            aria-hidden
            className="block h-11 font-display text-[104px] leading-[0.85] font-semibold text-brand"
          >
            “
          </span>
          <blockquote className="font-display text-[clamp(24px,2.6vw,38px)] leading-[1.3] font-medium tracking-[-0.015em] text-balance text-ink">
            {t("quote")}
          </blockquote>
          <p className="text-[17px] leading-[1.75] text-pretty text-ink-2">
            {t("body")}
          </p>
          <div className="flex flex-col gap-1 border-t border-rule pt-5">
            <span className="font-display text-lg font-semibold text-ink">
              {t("name")}
            </span>
            <span className="text-[15px] text-ink-3">{t("role")}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
