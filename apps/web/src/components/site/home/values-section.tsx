import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const VALUE_KEYS = [
  "people",
  "satisfaction",
  "quality",
  "responsibility",
] as const;

export async function ValuesSection() {
  const t = await getTranslations();

  return (
    <section aria-labelledby="values-title" className="pt-20 md:pt-32">
      <div className="site-container flex flex-wrap items-end justify-between gap-6 pb-8">
        <div className="grid gap-5">
          <p className="eyebrow text-ink-3">{t("nav.about")}</p>
          <h2
            id="values-title"
            className="text-[clamp(48px,5.8vw,84px)] leading-[0.96] font-semibold tracking-[-0.045em]"
          >
            {t("home.valuesTitle")}
          </h2>
        </div>
        <Link
          href="/human-resources"
          className={siteButtonClass("ghost", "group")}
        >
          {t("nav.careers")}
          <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
        </Link>
      </div>

      <ol className="border-b-2 border-rule">
        {VALUE_KEYS.map((key, index) => {
          const isTextFirst = index % 2 === 1;

          return (
            <li key={key} className="border-t-2 border-rule">
              <div className="site-container grid md:grid-cols-2">
                <div
                  aria-hidden
                  className={cn(
                    "h-[clamp(240px,33vw,480px)] bg-surface",
                    isTextFirst && "md:order-2",
                  )}
                />
                <Reveal
                  className={cn(
                    "flex flex-col justify-between gap-10 py-10 md:py-14",
                    isTextFirst ? "md:pr-12" : "md:pl-12",
                  )}
                >
                  <span className="text-[clamp(72px,8.3vw,120px)] leading-[0.9] font-semibold tracking-[-0.05em] text-brand tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="grid gap-4">
                    <h3 className="text-[clamp(32px,3.9vw,56px)] leading-none font-semibold tracking-heading text-balance uppercase">
                      {t(`home.values.${key}.title`)}
                    </h3>
                    <p className="max-w-130 text-lg text-pretty text-ink-2 md:text-[21px] md:leading-normal">
                      {t(`home.values.${key}.text`)}
                    </p>
                  </div>
                </Reveal>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
