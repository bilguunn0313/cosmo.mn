import { Grid2x2Check, Store, Truck, Warehouse } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ImageReveal } from "@/components/site/image-reveal";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";

const LOGISTICS_IMAGE = "/images/about/logistics-warehouse.webp";

const ITEMS = [
  { key: "warehouse", icon: Warehouse },
  { key: "distribution", icon: Truck },
  { key: "inventory", icon: Grid2x2Check },
  { key: "retail", icon: Store },
] as const;

export async function LogisticsSection() {
  const t = await getTranslations("about.logistics");

  return (
    <section
      aria-labelledby="logistics-title"
      className="bg-brand-700 pb-20 text-white md:pb-28"
    >
      <div className="relative h-70 overflow-hidden md:h-115">
        <ImageReveal>
          <Image
            src={LOGISTICS_IMAGE}
            alt={t("imageAlt")}
            fill
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        </ImageReveal>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-700 via-brand-700/40 via-55% to-brand-700/15"
        />
      </div>

      <div className="site-container relative -mt-30 flex flex-col gap-14">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="flex max-w-170 flex-col gap-4.5">
            <SectionEyebrow tone="white">{t("eyebrow")}</SectionEyebrow>
            <h2 id="logistics-title" className="type-section text-balance">
              {t.rich("title", {
                highlight: (chunks) => (
                  <span className="text-brand-400">{chunks}</span>
                ),
              })}
            </h2>
          </div>
          <p className="max-w-105 text-[17px] leading-relaxed text-pretty text-brand-200">
            {t("text")}
          </p>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, index) => (
            <li key={item.key}>
              <Reveal
                from="zoom"
                index={index}
                className="h-full rounded-card border border-white/14 bg-white/6 px-7 py-8"
              >
                <Reveal
                  index={index}
                  delay={0.15}
                  className="flex flex-col gap-3.5"
                >
                  <span className="font-display text-sm font-semibold tracking-[0.12em] text-brand-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <item.icon aria-hidden className="size-9" strokeWidth={1.5} />
                  <h3 className="font-display text-xl font-semibold">
                    {t(`items.${item.key}.title`)}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-pretty text-night-text">
                    {t(`items.${item.key}.text`)}
                  </p>
                </Reveal>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
