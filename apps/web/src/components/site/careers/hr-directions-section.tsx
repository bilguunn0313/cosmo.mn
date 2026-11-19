import { getTranslations } from "next-intl/server";
import {
  BulletPointIcon,
  CompassIcon,
  GrowthIcon,
  HomeIcon,
  MessageIcon,
  NetworkIcon,
  QualityIcon,
  SustainabilityIcon,
  TeamIcon,
} from "@/components/site/brand-icons";
import { Reveal } from "@/components/site/reveal";

const DIRECTIONS = [
  { key: "transparency", icon: BulletPointIcon },
  { key: "inclusion", icon: NetworkIcon },
  { key: "culture", icon: HomeIcon },
  { key: "development", icon: GrowthIcon },
  { key: "wellbeing", icon: TeamIcon },
  { key: "engagement", icon: MessageIcon },
  { key: "safeWorkplace", icon: QualityIcon },
  { key: "innovation", icon: SustainabilityIcon },
  { key: "leadership", icon: CompassIcon },
] as const;

export async function HrDirectionsSection() {
  const t = await getTranslations("careers.directions");

  return (
    <section aria-labelledby="hr-directions-title" className="pt-20 md:pt-32">
      <div className="site-container">
        <div className="grid gap-8 rounded-[32px] bg-brand-100 p-4 sm:p-8 md:gap-10 lg:p-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] xl:gap-14 xl:p-14">
          <Reveal>
            <h2
              id="hr-directions-title"
              className="flex flex-col gap-3 px-1 pt-2 text-ink sm:px-0 sm:pt-0"
            >
              <span className="type-h4 font-semibold text-balance text-ink-2">
                {t("lead")}
              </span>
              <span className="type-section text-balance">
                {t("title", { count: DIRECTIONS.length })}
              </span>
            </h2>
          </Reveal>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
            {DIRECTIONS.map(({ key, icon: Icon }, index) => (
              <li key={key} className="flex last:max-sm:col-span-2">
                <Reveal
                  index={index}
                  className="flex w-full flex-col items-center gap-4 rounded-card bg-white px-4 pt-7 pb-6 text-center md:gap-5 md:px-5 md:pt-9 md:pb-7"
                >
                  <Icon className="size-12 md:size-14" />
                  <span className="text-[15px] leading-snug font-medium text-balance text-ink md:text-base">
                    {t(`items.${key}`)}
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
