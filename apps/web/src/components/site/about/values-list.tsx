import {
  BadgeCheck,
  HandHeart,
  HeartHandshake,
  type LucideIcon,
  Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import {
  VALUE_IMAGE_PLACEHOLDERS,
  VALUE_KEYS,
  type ValueKey,
} from "@/lib/about";

const VALUE_ICONS: Record<ValueKey, LucideIcon> = {
  people: Users,
  satisfaction: HeartHandshake,
  quality: BadgeCheck,
  responsibility: HandHeart,
};

interface ValuesListProps {
  images: Record<ValueKey, string | null> | undefined;
}

export async function ValuesList({ images }: ValuesListProps) {
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
                className="relative flex aspect-4/5 flex-col justify-end gap-6 overflow-hidden rounded-card bg-brand-night p-6 text-white md:p-8"
              >
                <Image
                  src={images?.[key] ?? VALUE_IMAGE_PLACEHOLDERS[key]}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-brand-night/95 via-brand-night/55 to-brand-night/5"
                />
                <Icon
                  aria-hidden
                  strokeWidth={1.5}
                  className="relative size-11"
                />
                <div className="relative grid gap-3">
                  <h3 className="type-h4">{t(`home.values.${key}.title`)}</h3>
                  <p className="text-base leading-relaxed text-pretty text-white/85">
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
