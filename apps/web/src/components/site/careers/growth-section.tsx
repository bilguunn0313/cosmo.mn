import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";

const GROWTH_ITEMS = [
  { key: "training", highlights: ["training"] },
  { key: "rewards", highlights: ["bonus", "trip"] },
] as const;

export async function GrowthSection() {
  const t = await getTranslations("careers.growth");

  return (
    <section className="site-container grid gap-16 pt-20 md:pt-40 lg:grid-cols-2 lg:gap-6">
      {GROWTH_ITEMS.map((item, index) => (
        <Reveal
          key={item.key}
          index={index}
          className="flex flex-col gap-6"
        >
          <div className="grid gap-4">
            <h2 className="text-[clamp(36px,3.6vw,52px)] leading-none font-semibold tracking-[-0.04em]">
              {t(`${item.key}.title`)}
            </h2>
            <p className="max-w-150 text-lg leading-normal text-pretty text-ink-2">
              {t(`${item.key}.text`)}
            </p>
          </div>
          <ul className="mt-auto">
            {item.highlights.map((highlight) => (
              <li
                key={highlight}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-5 py-5"
              >
                <span className="text-[clamp(48px,5vw,80px)] leading-none font-semibold tracking-[-0.05em] text-brand tabular-nums">
                  {t(`highlights.${highlight}.value`)}
                </span>
                <span className="text-[17px] leading-[1.4]">
                  {t(`highlights.${highlight}.text`)}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </section>
  );
}
