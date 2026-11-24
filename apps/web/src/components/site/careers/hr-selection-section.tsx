import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  ApplicationIcon,
  MessageIcon,
  QualityIcon,
  TeamIcon,
} from "@/components/site/brand-icons";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";

const STEPS = [
  { key: "application", icon: ApplicationIcon },
  { key: "interview", icon: MessageIcon },
  { key: "assessment", icon: QualityIcon },
  { key: "decision", icon: TeamIcon },
] as const;

const START_MS = 500;
const TRAVEL_MS = 3000;
const ARRIVALS = [0, 0.27, 0.57, 0.87];

const trackStyle = {
  "--start": `${START_MS}ms`,
  "--travel": `${TRAVEL_MS}ms`,
} as React.CSSProperties;

function arrivalStyle(index: number) {
  const arrival = START_MS + ARRIVALS[index] * TRAVEL_MS;
  return { "--t": `${Math.round(arrival)}ms` } as React.CSSProperties;
}

export async function HrSelectionSection() {
  const t = await getTranslations("careers.selection");
  const lastIndex = STEPS.length - 1;

  return (
    <section
      aria-labelledby="hr-selection-title"
      className="selection-section relative isolate mt-20 overflow-hidden py-20 text-white md:mt-32 md:py-26"
    >
      <LogoMark className="absolute -right-24 -bottom-24 -z-10 w-80 text-white/5 md:-right-40 md:-bottom-44 md:w-140" />

      <div className="site-container">
        <Reveal className="mx-auto flex max-w-200 flex-col items-center gap-4 text-center">
          <h2 id="hr-selection-title" className="type-section text-balance">
            {t("title")}
          </h2>
          <p className="text-lg text-balance text-night-text">
            {t("lead", { count: STEPS.length })}
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-md md:mt-16 lg:max-w-295">
          <div className="selection-track relative" style={trackStyle}>
            <span aria-hidden className="selection-line">
              <span className="selection-fill" />
            </span>
            <span aria-hidden className="selection-run">
              <span className="selection-dot" />
            </span>

            <ol className="relative z-10 grid auto-rows-fr lg:auto-rows-auto lg:grid-cols-4">
              {STEPS.map(({ key, icon: Icon }, index) => (
                <li
                  key={key}
                  style={arrivalStyle(index)}
                  className="flex items-center gap-4.5 py-3 lg:flex-col lg:gap-5.5 lg:px-3.5 lg:py-0 lg:text-center lg:text-last-center"
                >
                  <span className="selection-node relative grid size-16 shrink-0 place-items-center rounded-full bg-white lg:size-24">
                    <Icon className="selection-icon h-7.5 w-auto max-w-8.5 lg:h-11.5 lg:max-w-13" />
                    <span className="selection-ring absolute inset-0 rounded-full border-2 border-white" />
                    {index === lastIndex && (
                      <span className="selection-check absolute -top-1 -right-1.5 grid size-6 place-items-center rounded-full bg-coral lg:-right-1 lg:size-7.5">
                        <Check
                          aria-hidden
                          strokeWidth={3}
                          className="size-3.5 text-white lg:size-4.5"
                        />
                      </span>
                    )}
                  </span>

                  <span className="selection-text flex flex-col gap-1 lg:items-center lg:gap-2">
                    <span className="font-display text-xs leading-snug font-semibold tracking-[0.14em] text-brand-300 uppercase lg:text-[13px]">
                      {t("stepLabel", { number: index + 1 })}
                    </span>
                    <span className="type-h4 text-balance">
                      {t(`steps.${key}`)}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
