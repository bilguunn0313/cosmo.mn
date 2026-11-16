import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { DEFAULT_BUSINESS_AREAS } from "@/lib/business-areas";
import { htmlToPlainText } from "@/lib/plain-text";
import type { PublicSection } from "@/lib/public-api";
import { cn } from "@/lib/utils";

interface BusinessArea {
  id: string;
  title: string;
  text: string;
  imageUrl: string | null;
}

function pairRowItemCount(count: number) {
  const remainder = count % 3;

  if (remainder === 2) {
    return 2;
  }

  if (remainder === 1 && count > 1) {
    return 4;
  }

  return 0;
}

function cardLayoutClass(index: number, count: number) {
  const isLastOfOddCount = count % 2 === 1 && index === count - 1;
  const isInPairRow = index >= count - pairRowItemCount(count);

  return cn(
    "h-80",
    isLastOfOddCount && "md:col-span-2",
    count === 1 && "lg:col-span-6 lg:h-95",
    count > 1 && (isInPairRow ? "lg:col-span-3" : "lg:col-span-2 lg:h-95"),
  );
}

interface BusinessAreasSectionProps {
  sections: PublicSection[];
}

export async function BusinessAreasSection({
  sections,
}: BusinessAreasSectionProps) {
  const t = await getTranslations("home.areas");

  const areas: BusinessArea[] =
    sections.length > 0
      ? sections.map((section) => ({
          id: String(section.id),
          title: section.title,
          text: htmlToPlainText(section.body),
          imageUrl: section.imageUrl,
        }))
      : DEFAULT_BUSINESS_AREAS.map((area) => ({
          id: area.key,
          title: t(`items.${area.key}.title`),
          text: t(`items.${area.key}.text`),
          imageUrl: area.imageUrl,
        }));

  return (
    <section
      aria-labelledby="areas-title"
      className="relative isolate overflow-hidden bg-brand py-20 text-white md:py-28"
    >
      <LogoMark className="absolute -top-30 -right-55 -z-10 w-245 text-white/6" />

      <div className="site-container">
        <Reveal className="mx-auto mb-12 flex max-w-190 flex-col items-center gap-4 text-center md:mb-14">
          <SectionEyebrow tone="white">{t("eyebrow")}</SectionEyebrow>
          <h2 id="areas-title" className="type-section text-balance">
            {t("title")}
          </h2>
          <p className="text-lg text-pretty text-brand-200">{t("text")}</p>
        </Reveal>

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {areas.map((area, index) => (
            <li key={area.id} className={cardLayoutClass(index, areas.length)}>
              <Reveal
                from="zoom"
                index={index}
                className="relative h-full overflow-hidden rounded-[20px] bg-brand-900"
              >
                {area.imageUrl && (
                  <Image
                    src={area.imageUrl}
                    alt=""
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-brand-900/90 via-brand-900/25 via-55% to-brand-900/0"
                />
                <Reveal
                  index={index}
                  delay={0.3}
                  className="absolute inset-x-6 bottom-6 flex max-w-115 flex-col gap-2"
                >
                  <h3 className="type-h3 leading-tight font-semibold">
                    {area.title}
                  </h3>
                  <p className="text-[15px] leading-normal text-pretty text-white/88">
                    {area.text}
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
