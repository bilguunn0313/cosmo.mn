import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";

const BODY_KEYS = ["body1", "body2"] as const;

interface CeoMessageProps {
  photoUrl: string | null;
}

export async function CeoMessage({ photoUrl }: CeoMessageProps) {
  const t = await getTranslations("about.ceo");

  return (
    <section
      aria-labelledby="ceo-title"
      className="overflow-x-clip py-20 md:py-30"
    >
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

        <Reveal from="right" delay={0.09} className="flex flex-col">
          <SectionEyebrow as="h2" id="ceo-title">
            {t("title")}
          </SectionEyebrow>
          <span
            aria-hidden
            className="mt-8 block h-9 font-display text-[88px] leading-[0.85] font-semibold text-brand"
          >
            “
          </span>
          <blockquote className="mt-4 font-display text-[clamp(22px,1.6vw_+_8px,29px)] leading-[1.4] font-medium tracking-[-0.01em] text-balance text-ink">
            {t("quote")}
          </blockquote>
          <div className="mt-8 flex max-w-[66ch] flex-col gap-4">
            {BODY_KEYS.map((key) => (
              <p
                key={key}
                className="text-[17px] leading-[1.75] text-pretty text-even text-ink-2"
              >
                {t(key)}
              </p>
            ))}
          </div>
          <div className="mt-9 flex max-w-[66ch] flex-col gap-1 border-t border-rule pt-6">
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
