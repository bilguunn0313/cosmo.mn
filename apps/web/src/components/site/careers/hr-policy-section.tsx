import { getTranslations } from "next-intl/server";
import Image from "next/image";
import {
  BulletPointIcon,
  GlobalSourcingIcon,
  QualityIcon,
} from "@/components/site/brand-icons";
import { Reveal } from "@/components/site/reveal";

const PRINCIPLES = [
  { key: "open", icon: BulletPointIcon },
  { key: "accessible", icon: GlobalSourcingIcon },
  { key: "clear", icon: QualityIcon },
] as const;

const BENEFIT_KEYS = ["pay", "career"] as const;

interface HrPolicySectionProps {
  imageUrl: string;
}

export async function HrPolicySection({ imageUrl }: HrPolicySectionProps) {
  const t = await getTranslations("careers.policy");

  return (
    <section
      id="hr-policy"
      aria-labelledby="hr-policy-title"
      className="scroll-mt-28 pt-8 md:pt-14"
    >
      <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="flex flex-col gap-8">
          <h1
            id="hr-policy-title"
            className="type-section text-balance text-ink"
          >
            {t("title")}
          </h1>

          <div className="flex flex-col gap-4">
            <h2 className="type-h4 font-semibold text-ink">
              {t("principlesLabel")}
            </h2>
            <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-7">
              {PRINCIPLES.map(({ key, icon: Icon }) => (
                <li key={key} className="flex items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-control bg-brand-100">
                    <Icon className="h-7 w-8" />
                  </span>
                  <span className="text-base font-medium text-ink">
                    {t(`principles.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="max-w-[66ch] text-[17px] leading-[1.75] text-pretty text-even text-ink-2">
            {t("body")}
          </p>
        </Reveal>

        <Reveal
          from="right"
          delay={0.1}
          className="relative aspect-4/3 overflow-hidden rounded-card bg-surface"
        >
          <Image
            src={imageUrl}
            alt={t("imageAlt")}
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
      </div>

      <ul className="site-container mt-14 grid gap-10 md:mt-20 md:grid-cols-2 md:gap-x-16">
        {BENEFIT_KEYS.map((key, index) => (
          <li key={key}>
            <Reveal
              index={index}
              className="flex h-full flex-col gap-3 border-t-2 border-brand pt-6"
            >
              <h3 className="type-h4 font-semibold text-ink">
                {t(`benefits.${key}.title`)}
              </h3>
              <p className="text-[17px] leading-[1.75] text-pretty text-even text-ink-2">
                {t(`benefits.${key}.text`)}
              </p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
