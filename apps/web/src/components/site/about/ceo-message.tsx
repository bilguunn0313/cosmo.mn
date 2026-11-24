import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";
import { imageFrameStyle } from "@/lib/image-frame";

const BODY_KEYS = ["body1", "body2", "body3", "body4"] as const;

interface CeoMessageProps {
  photoUrl: string | null;
}

export async function CeoMessage({ photoUrl }: CeoMessageProps) {
  const t = await getTranslations("about.ceo");

  return (
    <section
      aria-label={t("title")}
      className="overflow-x-clip pt-10 pb-20 md:pt-16 md:pb-30 lg:pt-22"
    >
      <div className="site-container">
        <div className="grid gap-4 xl:grid-cols-2 xl:gap-8">
          <Reveal
            from="left"
            className="relative aspect-4/5 overflow-hidden rounded-card bg-linear-160 from-brand to-brand-700 sm:aspect-4/3 xl:aspect-2/3 xl:self-stretch min-[90rem]:aspect-4/5"
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                style={imageFrameStyle(photoUrl)}
                alt={t("name")}
                fill
                priority
                unoptimized
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            ) : (
              <LogoMark className="absolute inset-0 m-auto w-[38%] text-white/14" />
            )}
          </Reveal>

          <Reveal
            from="right"
            delay={0.09}
            className="ceo-card relative isolate flex flex-col justify-center overflow-hidden rounded-card px-5.5 py-8 text-white sm:p-10 xl:p-14"
          >
            <LogoMark className="absolute -right-20 -bottom-18 -z-10 w-65 text-white/6 lg:-right-28 lg:-bottom-30 lg:w-105" />
            <h3 className="type-h2 font-bold tracking-normal text-balance uppercase">
              {t("name")}
            </h3>
            <p className="mt-2 font-display text-[13px] font-medium tracking-[0.08em] text-brand-300 uppercase md:mt-2.5 md:text-[15px]">
              {t("role")}
            </p>
            <div className="mt-6 flex flex-col gap-3.5 md:mt-9 md:gap-4.5">
              {BODY_KEYS.map((key) => (
                <p
                  key={key}
                  className="indent-[2em] text-base leading-[1.75] text-night-text md:text-[17px]"
                >
                  {t(key)}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
