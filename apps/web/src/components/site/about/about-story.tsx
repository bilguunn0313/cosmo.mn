import { getTranslations } from "next-intl/server";
import { StoryRow, StorySections } from "@/components/site/story-sections";
import type { PublicSection } from "@/lib/public-api";

const AWARD_KEYS = ["taxpayer", "top100", "top150"] as const;

interface AboutStoryProps {
  sections: PublicSection[];
}

export async function AboutStory({ sections }: AboutStoryProps) {
  const t = await getTranslations("about");

  return (
    <section className="site-container pt-20 md:pt-32">
      <div className="border-b-2 border-rule">
        <StoryRow index={0} label={t("missionLabel")} imageUrl={null}>
          <p className="max-w-150 text-[clamp(36px,4vw,60px)] leading-none font-semibold tracking-[-0.045em] text-balance">
            {t("missionText")}
          </p>
        </StoryRow>

        <StoryRow index={1} label={t("nationalLabel")} imageUrl={null}>
          <ul className="mt-2 border-t-2 border-rule">
            {AWARD_KEYS.map((key) => (
              <li
                key={key}
                className="grid grid-cols-[88px_minmax(0,1fr)] items-baseline gap-4 border-rule py-4 not-last:border-b-2 md:grid-cols-[120px_minmax(0,1fr)]"
              >
                <span className="text-[clamp(36px,3vw,44px)] leading-none font-semibold tracking-[-0.05em] text-brand">
                  {t(`awards.${key}.count`)}
                </span>
                <span className="text-[17px] font-semibold">
                  {t(`awards.${key}.text`)}
                </span>
              </li>
            ))}
          </ul>
        </StoryRow>

        <StorySections sections={sections} startIndex={2} />
      </div>
    </section>
  );
}
