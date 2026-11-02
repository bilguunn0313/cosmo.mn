import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { LogoMark } from "@/components/site/logo-mark";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { cn } from "@/lib/utils";

const BUSINESS_AREAS = [
  { key: "import", imageUrl: "/images/home/area-import.webp" },
  { key: "warehouse", imageUrl: "/images/home/area-warehouse.webp" },
  { key: "distribution", imageUrl: "/images/home/area-distribution.webp" },
  { key: "sales", imageUrl: "/images/home/area-sales.webp" },
  { key: "marketing", imageUrl: "/images/home/area-marketing.webp" },
] as const;

const TOP_ROW_SIZE = 3;

export async function BusinessAreasSection() {
  const t = await getTranslations("home.areas");

  return (
    <section
      aria-labelledby="areas-title"
      className="relative isolate overflow-hidden bg-brand py-20 text-white md:py-28"
    >
      <LogoMark className="absolute -top-30 -right-55 -z-10 w-245 text-white/6" />

      <div className="site-container">
        <div className="mx-auto mb-12 flex max-w-190 flex-col items-center gap-4 text-center md:mb-14">
          <SectionEyebrow tone="white">{t("eyebrow")}</SectionEyebrow>
          <h2 id="areas-title" className="type-section text-balance">
            {t("title")}
          </h2>
          <p className="text-lg text-pretty text-brand-200">{t("text")}</p>
        </div>

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {BUSINESS_AREAS.map((area, index) => (
            <li
              key={area.key}
              className={cn(
                "relative h-80 overflow-hidden rounded-[20px] bg-brand-900",
                index === BUSINESS_AREAS.length - 1 && "md:col-span-2",
                index < TOP_ROW_SIZE
                  ? "lg:col-span-2 lg:h-95"
                  : "lg:col-span-3",
              )}
            >
              <Image
                src={area.imageUrl}
                alt=""
                fill
                unoptimized
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-brand-900/90 via-brand-900/25 via-55% to-brand-900/0"
              />
              <div className="absolute inset-x-6 bottom-6 flex max-w-115 flex-col gap-2">
                <h3 className="font-display text-[26px] leading-tight font-semibold">
                  {t(`items.${area.key}.title`)}
                </h3>
                <p className="text-[15px] leading-normal text-pretty text-white/88">
                  {t(`items.${area.key}.text`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
