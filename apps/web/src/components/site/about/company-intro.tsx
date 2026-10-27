import { getTranslations } from "next-intl/server";
import {
  BrandsIcon,
  DistributionIcon,
  HomeIcon,
  ShoppingIcon,
  TeamIcon,
} from "@/components/site/brand-icons";
import { Reveal } from "@/components/site/reveal";

const SALES_CHANNELS = [
  { key: "supermarket", icon: ShoppingIcon },
  { key: "hypermarket", icon: BrandsIcon },
  { key: "retail", icon: HomeIcon },
  { key: "wholesale", icon: DistributionIcon },
  { key: "horeca", icon: TeamIcon },
] as const;

export async function CompanyIntro() {
  const t = await getTranslations("about.intro");

  return (
    <section
      aria-label={t("label")}
      className="site-container grid gap-8 pt-16 md:gap-10 md:pt-24"
    >
      <Reveal>
        <p className="max-w-240 type-h3 text-balance">{t("lead")}</p>
      </Reveal>

      <Reveal
        index={1}
        className="grid gap-5 text-base leading-relaxed text-pretty text-ink-2 md:grid-cols-2 md:gap-10"
      >
        <p>{t("body1")}</p>
        <p>{t("body2")}</p>
      </Reveal>

      <div className="grid gap-4">
        <h2 className="font-display text-sm font-semibold text-ink-3">
          {t("channelsTitle")}
        </h2>
        <ul className="flex flex-wrap gap-3">
          {SALES_CHANNELS.map((channel, index) => (
            <li key={channel.key}>
              <Reveal
                index={index}
                className="flex items-center gap-3 rounded-control bg-brand-100 py-3 pr-5 pl-3"
              >
                <channel.icon className="h-8 w-auto shrink-0" />
                <span className="font-display text-base font-medium">
                  {t(`channels.${channel.key}`)}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
