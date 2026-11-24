import { getTranslations } from "next-intl/server";
import Image from "next/image";
import {
  HomeIcon,
  NetworkIcon,
  SustainabilityIcon,
} from "@/components/site/brand-icons";
import { Reveal } from "@/components/site/reveal";
import { imageFrameStyle } from "@/lib/image-frame";

const CULTURE_ITEMS = [
  { key: "team", icon: NetworkIcon },
  { key: "office", icon: HomeIcon },
  { key: "balance", icon: SustainabilityIcon },
] as const;

interface HrCultureSectionProps {
  imageUrl: string;
}

export async function HrCultureSection({ imageUrl }: HrCultureSectionProps) {
  const t = await getTranslations("careers.culture");

  return (
    <section
      id="hr-culture"
      aria-labelledby="hr-culture-title"
      className="scroll-mt-28 pt-20 md:pt-32"
    >
      <div className="site-container grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal
          from="left"
          className="relative order-last aspect-4/3 overflow-hidden rounded-card bg-surface lg:order-first lg:aspect-auto lg:min-h-120"
        >
          <Image
            src={imageUrl}
            style={imageFrameStyle(imageUrl)}
            alt={t("imageAlt")}
            fill
            unoptimized
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal
          from="right"
          delay={0.1}
          className="flex flex-col justify-center gap-8"
        >
          <h2
            id="hr-culture-title"
            className="type-section text-balance text-ink"
          >
            {t("title")}
          </h2>

          <ul className="flex flex-col gap-7">
            {CULTURE_ITEMS.map(({ key, icon: Icon }) => (
              <li key={key} className="flex gap-4 md:gap-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-control bg-brand-100">
                  <Icon className="h-7 w-8" />
                </span>
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <h3 className="type-h4 font-semibold text-ink">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="text-[17px] leading-[1.7] text-pretty text-ink-2">
                    {t(`items.${key}.text`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
