import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/site/reveal";

const TRAIT_KEYS = ["open", "flexible", "feedback"] as const;
const VALUE_KEYS = [
  "ethical",
  "professional",
  "accountable",
  "transparent",
] as const;

interface HrGovernanceSectionProps {
  imageUrl: string;
}

export async function HrGovernanceSection({
  imageUrl,
}: HrGovernanceSectionProps) {
  const t = await getTranslations("careers.governance");

  return (
    <section
      id="hr-governance"
      aria-labelledby="hr-governance-title"
      className="scroll-mt-28 pt-20 md:pt-32"
    >
      <div className="site-container grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal
          from="left"
          className="relative order-last min-h-110 overflow-hidden rounded-card bg-surface sm:min-h-120 lg:order-first"
        >
          <Image
            src={imageUrl}
            alt={t("imageAlt")}
            fill
            unoptimized
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-brand-night/90 via-brand-night/35 via-45% to-transparent to-75%"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 sm:p-8">
            <p className="type-h4 font-semibold text-white">
              {t("specialistsLabel")}
            </p>
            <ul className="flex flex-col gap-2.5">
              {TRAIT_KEYS.map((key) => (
                <li
                  key={key}
                  className="rounded-full bg-brand/90 px-6 py-3 text-[15px] font-medium text-white"
                >
                  {t(`traits.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal
          from="right"
          delay={0.1}
          className="flex flex-col justify-center gap-6"
        >
          <h2
            id="hr-governance-title"
            className="type-section text-balance text-ink"
          >
            {t("title")}
          </h2>
          <p className="max-w-[66ch] text-[17px] leading-[1.75] text-pretty text-even text-ink-2">
            {t("text")}
          </p>
          <ul className="grid grid-cols-2 gap-3 md:gap-4">
            {VALUE_KEYS.map((key) => (
              <li
                key={key}
                className="flex min-h-22 items-center justify-center rounded-card bg-brand-100 px-4 py-5 text-center type-h4 font-medium text-balance text-ink"
              >
                {t(`values.${key}`)}
              </li>
            ))}
          </ul>
          <p className="max-w-[66ch] text-[17px] leading-[1.75] text-pretty text-even text-ink-2">
            {t("closing")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
