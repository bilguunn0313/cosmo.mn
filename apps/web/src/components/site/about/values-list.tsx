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
        {VALUE_KEYS.map((key) => {
          const imageUrl = ABOUT_CONTENT.valueImageUrls[key];

          return (
            <li
              key={key}
              className="grid gap-4 border-b border-rule py-8 md:grid-cols-12 md:items-center md:gap-x-6 md:py-12"
            >
              <Reveal className="flex items-center gap-6 md:col-span-4">
                {imageUrl && (
                  <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-card bg-brand-100 md:w-[clamp(96px,8vw,144px)]">
                    <Image
                      src={imageUrl}
                      alt=""
                      fill
                      unoptimized
                      sizes="144px"
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="text-[clamp(28px,2.6vw,40px)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-brand">
                  {t(`home.values.${key}.title`)}
                </h3>
              </Reveal>
              <Reveal delay={0.08} className="md:col-span-7 md:col-start-6">
                <p className="max-w-180 text-[clamp(20px,1.7vw,26px)] leading-snug tracking-[-0.01em] text-pretty text-ink-2">
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
