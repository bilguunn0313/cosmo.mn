import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { Link } from "@/i18n/navigation";
import { ABOUT_CONTENT, VALUE_KEYS } from "@/lib/about";

export async function ValuesList() {
  const t = await getTranslations();

  return (
    <section
      aria-labelledby="values-title"
      className="site-container pt-24 md:pt-32 xl:pt-40"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink pb-6 md:pb-10">
        <h2
          id="values-title"
          className="text-[clamp(40px,4.8vw,72px)] leading-[0.95] font-semibold tracking-[-0.045em]"
        >
          {t("home.valuesTitle")}
        </h2>
        <Link
          href="/human-resources"
          className={siteButtonClass("ghost", "group")}
        >
          {t("nav.careers")}
          <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
        </Link>
      </div>

      <ul>
        {VALUE_KEYS.map((key, index) => {
          const imageUrl = ABOUT_CONTENT.valueImageUrls[key];

          return (
            <li
              key={key}
              className="flex flex-col gap-5 border-b border-rule py-8 sm:flex-row sm:items-center sm:gap-12 md:py-14 lg:gap-24"
            >
              <Reveal className="relative flex aspect-square w-28 shrink-0 items-end overflow-hidden rounded-card bg-brand-100 p-4 sm:w-[clamp(120px,14vw,200px)]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    unoptimized
                    sizes="200px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[clamp(40px,4vw,64px)] leading-none font-semibold tracking-[-0.05em] text-brand tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </Reveal>
              <Reveal delay={0.08} className="min-w-0 flex-1">
                <p className="text-[clamp(24px,2.6vw,40px)] leading-tight font-medium tracking-[-0.025em] text-pretty">
                  <strong className="font-semibold text-brand">
                    {t(`home.values.${key}.title`)}.
                  </strong>{" "}
                  {t(`home.values.${key}.text`)}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
