import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";

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
    },
    {
      key: "vision",
      title: t.rich("values.visionTitle", { highlight }),
      text: t("visionText"),
    },
  ];

  return (
    <section aria-label={t("values.purposeEyebrow")} className="pb-20 md:pb-30">
      <div className="site-container grid gap-4 md:grid-cols-2 xl:gap-8">
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
    </section>
  );
}
