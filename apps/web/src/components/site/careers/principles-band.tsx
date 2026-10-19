import { getTranslations } from "next-intl/server";
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
      className="mt-20 bg-brand-night text-white md:mt-40"
    >
      <div className="site-container grid gap-10 py-16 md:gap-14 md:py-26">
        <div className="grid gap-5">
          <p className="eyebrow text-brand-300">{t("principlesEyebrow")}</p>
          <h2 id="principles-title" className="type-h2">
            {t("principlesTitle")}
          </h2>
        </div>
        <ol className="grid gap-x-12 md:grid-cols-2">
          {PRINCIPLE_KEYS.map((key, index) => (
            <li key={key} className="border-t-2 border-white/28">
              <Reveal
                index={index % 2}
                className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 py-5 md:grid-cols-[56px_minmax(0,1fr)] md:py-6"
              >
                <span className="text-[15px] font-semibold text-brand-300 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="type-h4">{t(`principles.${key}`)}</span>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
