import {
  BadgeCheck,
  HandHeart,
  HeartHandshake,
  type LucideIcon,
  Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { VALUE_KEYS, type ValueKey } from "@/lib/about";

const VALUE_ICONS: Record<ValueKey, LucideIcon> = {
  people: Users,
  satisfaction: HeartHandshake,
  quality: BadgeCheck,
  responsibility: HandHeart,
};

export async function ValuesList() {
  const t = await getTranslations();

  return (
    <section
      aria-labelledby="values-title"
      className="site-container pt-20 md:pt-28"
    >
      <h2 id="values-title" className="type-h2 pb-8 md:pb-10">
        {t("home.valuesTitle")}
      </h2>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {VALUE_KEYS.map((key, index) => {
          const Icon = VALUE_ICONS[key];

          return (
            <li key={key}>
              <Reveal
                index={index}
                className="flex h-full flex-col gap-8 rounded-card bg-surface p-6 md:p-8"
              >
                <Icon
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-12 text-brand"
                />
                <div className="grid gap-3">
                  <h3 className="type-h4">{t(`home.values.${key}.title`)}</h3>
                  <p className="text-[17px] leading-relaxed text-pretty text-ink-2">
                    {t(`home.values.${key}.text`)}
                  </p>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
