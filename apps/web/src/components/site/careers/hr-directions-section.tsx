import {
  Building2,
  Compass,
  Eye,
  GraduationCap,
  HeartPulse,
  Lightbulb,
  MessagesSquare,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

const DIRECTIONS = [
  { key: "transparency", icon: Eye, place: "xl:col-start-3" },
  { key: "inclusion", icon: UsersRound, place: "" },
  { key: "culture", icon: Building2, place: "" },
  { key: "development", icon: GraduationCap, place: "" },
  { key: "wellbeing", icon: HeartPulse, place: "" },
  { key: "engagement", icon: MessagesSquare, place: "" },
  { key: "safeWorkplace", icon: ShieldCheck, place: "xl:col-start-2" },
  { key: "innovation", icon: Lightbulb, place: "" },
  { key: "leadership", icon: Compass, place: "max-sm:col-span-2" },
] as const;

export async function HrDirectionsSection() {
  const t = await getTranslations("careers.directions");

  return (
    <section aria-labelledby="hr-directions-title" className="pt-20 md:pt-32">
      <div className="site-container">
        <div className="flex flex-col gap-10 rounded-[32px] bg-brand-100 p-5 sm:p-8 lg:p-10 xl:flex-row xl:gap-12 xl:p-12">
          <Reveal className="xl:w-[34%] xl:shrink-0 xl:pt-4">
            <h2
              id="hr-directions-title"
              className="flex flex-col gap-3 text-ink"
            >
              <span className="type-h4 font-semibold text-balance text-ink-2">
                {t("lead")}
              </span>
              <span className="type-section text-balance">
                {t("title", { count: DIRECTIONS.length })}
              </span>
            </h2>
          </Reveal>

          <ol className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 xl:grid-cols-4">
            {DIRECTIONS.map(({ key, icon: Icon, place }, index) => (
              <li key={key} className={cn("flex", place)}>
                <Reveal
                  index={index}
                  className="relative flex w-full flex-col items-center gap-4 rounded-card bg-white px-3 pt-8 pb-6 text-center xl:aspect-square"
                >
                  <span
                    aria-hidden
                    className="absolute top-3 right-4 font-display text-xl font-semibold text-ink tabular-nums"
                  >
                    {index + 1}
                  </span>
                  <span className="flex size-14 items-center justify-center rounded-full bg-linear-160 from-brand to-brand-700 text-white md:size-16">
                    <Icon aria-hidden strokeWidth={1.5} className="size-7" />
                  </span>
                  <span className="text-sm leading-snug font-medium text-balance text-ink">
                    {t(`items.${key}`)}
                  </span>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
