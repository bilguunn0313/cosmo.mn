import { CircleCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";

const PRINCIPLE_KEYS = [
  "nonDiscrimination",
  "freedomToWork",
  "noHarassment",
  "noForcedLabor",
  "humanRights",
  "reputation",
  "respectCustomers",
] as const;

export async function PrinciplesBand() {
  const t = await getTranslations("careers");

  return (
    <section
      aria-labelledby="principles-title"
      className="relative mt-20 overflow-hidden bg-brand-night text-white md:mt-32"
    >
      <LogoMark className="pointer-events-none absolute -top-[10%] -right-[8%] w-[min(560px,60vw)] text-white/[0.04]" />
      <div className="site-container relative grid gap-10 py-16 md:gap-14 md:py-26">
        <div className="grid gap-5">
          <p className="eyebrow text-brand-300">{t("principlesEyebrow")}</p>
          <h2 id="principles-title" className="type-h2">
            {t("principlesTitle")}
          </h2>
        </div>
        <ul className="grid gap-x-12 md:grid-cols-2">
          {PRINCIPLE_KEYS.map((key, index) => (
            <li key={key} className="border-t border-white/15">
              <Reveal
                index={index % 2}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 py-5 md:gap-5 md:py-6"
              >
                <CircleCheck
                  aria-hidden
                  className="mt-0.5 size-6 text-brand-400"
                  strokeWidth={1.5}
                />
                <span className="type-h4">{t(`principles.${key}`)}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
