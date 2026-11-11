import type { BrandCategory } from "@cosmo/shared";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import type { PublicBrand } from "@/lib/public-api";
import { cn } from "@/lib/utils";
import { BrandLogoCard } from "./brand-logo-card";
import { CategoryIllustration } from "./category-illustration";

const REVEAL_COLUMNS = 4;

export function chapterId(category: BrandCategory) {
  return category.toLowerCase();
}

interface BrandChapterProps {
  category: BrandCategory;
  brands: PublicBrand[];
  isAlternate: boolean;
}

export async function BrandChapter({
  category,
  brands,
  isAlternate,
}: BrandChapterProps) {
  const t = await getTranslations();
  const id = chapterId(category);
  const title = t(`brands.chapters.${category}.title`);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "scroll-mt-16 py-18 md:py-26 lg:scroll-mt-21",
        isAlternate && "bg-brand-100/50",
      )}
    >
      <div className="site-container">
        <div className="grid items-center gap-9 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <Reveal>
              <SectionEyebrow>
                {t(`brands.chapters.${category}.label`)}
              </SectionEyebrow>
            </Reveal>
            <Reveal index={1}>
              <h2
                id={`${id}-title`}
                className="type-section text-balance text-ink"
              >
                {title}
              </h2>
            </Reveal>
            <Reveal index={2}>
              <p className="text-lg leading-[1.65] text-pretty text-ink-2">
                {t(`brands.chapters.${category}.text`)}
              </p>
            </Reveal>
            {category === "FOOD" && (
              <Reveal index={3}>
                <p className="mt-1 flex items-center gap-5 border-t border-rule pt-6">
                  <span className="font-display text-5xl leading-none font-semibold tracking-[-0.04em] text-coral md:text-[64px]">
                    {t("brands.chapters.FOOD.statValue")}
                  </span>
                  <span className="max-w-65 text-[15px] leading-normal text-ink">
                    {t("brands.chapters.FOOD.statLabel")}
                  </span>
                </p>
              </Reveal>
            )}
          </div>

          <Reveal className="max-sm:hidden">
            <div
              className={cn(
                "shelf-scene rounded-[24px] px-6 pt-7 md:px-12 md:pt-12",
                isAlternate ? "bg-white" : "bg-brand-100",
              )}
            >
              <CategoryIllustration category={category} label={title} />
            </div>
          </Reveal>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-7 md:mt-14 md:grid-cols-3 md:gap-x-5 md:gap-y-8 lg:grid-cols-4">
          {brands.map((brand, index) => (
            <li key={brand.slug}>
              <Reveal index={index % REVEAL_COLUMNS} className="h-full">
                <BrandLogoCard brand={brand} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
