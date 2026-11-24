import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { imageFrameStyle } from "@/lib/image-frame";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE = "/images/about/logistics-warehouse.webp";
const SHOW_PURPOSE_IMAGE = false;

function highlight(chunks: React.ReactNode) {
  return <span className="text-brand">{chunks}</span>;
}

interface PurposeSectionProps {
  imageUrl: string | null;
}

export async function PurposeSection({ imageUrl }: PurposeSectionProps) {
  const t = await getTranslations("about");

  const purposes = [
    {
      key: "mission",
      title: t.rich("values.missionTitle", { highlight }),
      text: t("missionText"),
    },
    {
      key: "vision",
      title: t.rich("values.visionTitle", { highlight }),
      text: t("visionText"),
    },
  ];

  return (
    <section aria-label={t("values.purposeEyebrow")} className="pb-20 md:pb-30">
      <div
        className={cn(
          "site-container grid gap-4 xl:gap-8",
          SHOW_PURPOSE_IMAGE && "xl:grid-cols-2",
        )}
      >
        {SHOW_PURPOSE_IMAGE && (
          <Reveal
            from="right"
            className="relative aspect-4/5 overflow-hidden rounded-card bg-brand-100 sm:aspect-4/3 xl:order-last xl:aspect-2/3 xl:self-stretch min-[90rem]:aspect-4/5"
          >
            <Image
              src={imageUrl ?? FALLBACK_IMAGE}
              style={imageFrameStyle(imageUrl ?? FALLBACK_IMAGE)}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        )}

        <div
          className={cn(
            "grid gap-4 xl:gap-8",
            !SHOW_PURPOSE_IMAGE && "md:grid-cols-2",
          )}
        >
          {purposes.map(({ key, title, text }, index) => (
            <Reveal
              key={key}
              from="left"
              index={index}
              className="flex flex-col rounded-card bg-brand-100 px-5.5 py-8 sm:p-10 xl:p-14"
            >
              <h2 className="type-h2 font-bold tracking-normal text-balance text-ink uppercase">
                {title}
              </h2>
              <p className="mt-4 font-display text-xl leading-[1.45] font-medium text-ink md:text-[22px]">
                {text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
