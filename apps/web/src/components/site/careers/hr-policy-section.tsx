import { getTranslations } from "next-intl/server";
import Image from "next/image";
import {
  BanknoteIcon,
  BulletPointIcon,
  GrowthIcon,
} from "@/components/site/brand-icons";
import { Reveal } from "@/components/site/reveal";
import { imageFrameStyle } from "@/lib/image-frame";

const POLICY_ITEMS = [
  { key: "open", icon: BulletPointIcon },
  { key: "salary", icon: BanknoteIcon },
  { key: "career", icon: GrowthIcon },
] as const;

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

          <ul className="flex flex-col gap-7">
            {POLICY_ITEMS.map(({ key, icon: Icon }) => (
              <li key={key} className="flex gap-4 md:gap-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-control bg-brand-100">
                  <Icon className="h-7 w-8" />
                </span>
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <h2 className="type-h4 font-semibold text-ink">
                    {t(`items.${key}.title`)}
                  </h2>
                  <p className="text-[17px] leading-[1.7] text-pretty text-ink-2">
                    {t(`items.${key}.text`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal
          from="right"
          delay={0.1}
          className="relative aspect-4/3 overflow-hidden rounded-card bg-surface lg:aspect-auto lg:min-h-120 lg:self-stretch"
        >
          <Image
            src={imageUrl}
            style={imageFrameStyle(imageUrl)}
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
