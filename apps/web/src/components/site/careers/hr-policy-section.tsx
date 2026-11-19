import { Eye, Globe, ListChecks } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/site/reveal";

const PRINCIPLES = [
  { key: "open", icon: Eye },
  { key: "accessible", icon: Globe },
  { key: "clear", icon: ListChecks },
] as const;

const BODY_KEYS = ["body1", "body2"] as const;

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

          <div className="flex flex-col gap-5">
            <h2 className="type-h4 font-semibold text-ink">
              {t("principlesLabel")}
            </h2>
            <ul className="grid max-w-120 grid-cols-3 gap-3 sm:gap-6">
              {PRINCIPLES.map(({ key, icon: Icon }) => (
                <li
                  key={key}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <span className="flex size-18 items-center justify-center rounded-card bg-brand-100 text-brand sm:size-20">
                    <Icon aria-hidden strokeWidth={1.5} className="size-9" />
                  </span>
                  <span className="text-[15px] leading-snug font-medium text-balance text-ink">
                    {t(`principles.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex max-w-[66ch] flex-col gap-4">
            {BODY_KEYS.map((key) => (
              <p
                key={key}
                className="text-[17px] leading-[1.75] text-pretty text-even text-ink-2"
              >
                {t(key)}
              </p>
            ))}
          </div>
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
    </section>
  );
}
