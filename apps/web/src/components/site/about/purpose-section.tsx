import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";
import { MissionArt, VisionArt } from "./values-art";

function highlight(chunks: React.ReactNode) {
  return <span className="text-brand">{chunks}</span>;
}

export async function PurposeSection() {
  const t = await getTranslations("about");

  const purposes = [
    {
      key: "mission",
      title: t.rich("values.missionTitle", { highlight }),
      text: t("missionText"),
      art: <MissionArt label={t("values.missionArt")} />,
    },
    {
      key: "vision",
      title: t.rich("values.visionTitle", { highlight }),
      text: t("visionText"),
      art: <VisionArt label={t("values.visionArt")} />,
    },
  ];

  return (
    <section
      aria-label={t("values.purposeEyebrow")}
      className="site-container pt-10 pb-4 md:pt-16 md:pb-6 lg:pt-20"
    >
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-0">
        {purposes.map((purpose, index) => (
          <Reveal
            key={purpose.key}
            index={index}
            className={cn(
              "flex flex-col items-center text-center lg:px-14",
              index > 0 && "lg:border-l lg:border-rule",
            )}
          >
            <div className="w-full max-w-95 lg:h-56 lg:[&_svg]:h-full">
              {purpose.art}
            </div>
            <h3 className="mt-6 type-display text-balance text-ink">
              {purpose.title}
            </h3>
            <p className="mt-4 max-w-115 font-display text-xl leading-[1.45] font-medium text-balance text-ink md:text-[22px]">
              {purpose.text}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
