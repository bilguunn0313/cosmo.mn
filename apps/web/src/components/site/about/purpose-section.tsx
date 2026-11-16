import { getTranslations } from "next-intl/server";
import { StatNumber } from "@/components/site/home/stat-number";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import type { PublicSiteSetting } from "@/lib/public-api";
import { cn } from "@/lib/utils";

interface PurposeSectionProps {
  setting: PublicSiteSetting | null;
}

export async function PurposeSection({ setting }: PurposeSectionProps) {
  const t = await getTranslations("about");
  const foundedYear = setting?.foundedYear;

  const statements = [
    { key: "mission", label: t("missionLabel"), text: t("missionText") },
    { key: "vision", label: t("visionLabel"), text: t("visionText") },
  ];

  const stats = [
    {
      key: "years",
      value: foundedYear ? new Date().getFullYear() - foundedYear : null,
    },
    { key: "products", value: setting?.productCount ?? null },
    { key: "salesPoints", value: setting?.salesPointCount ?? null },
    { key: "team", value: setting?.employeeCount ?? null },
  ] as const;

  const visibleStats = stats.filter((stat) => stat.value);

  return (
    <section
      aria-labelledby="purpose-title"
      className="relative isolate overflow-hidden bg-brand py-20 text-white md:py-28"
    >
      <LogoMark className="absolute -top-30 -right-55 -z-10 w-225 text-white/6" />

      <div className="site-container flex flex-col gap-12">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="flex max-w-170 flex-col gap-4.5">
            <SectionEyebrow tone="white">{t("purposeTitle")}</SectionEyebrow>
            <h2 id="purpose-title" className="type-section text-balance">
              {t("sloganText")}
            </h2>
          </div>
          <p className="max-w-105 text-[17px] leading-relaxed text-pretty text-brand-200">
            {t("description")}
          </p>
        </Reveal>

        <dl className="grid overflow-hidden rounded-card bg-white/8 md:grid-cols-2">
          {statements.map((statement, index) => (
            <Reveal
              key={statement.key}
              index={index}
              className={cn(
                "flex flex-col gap-3 px-8 py-8 md:px-10 md:py-9",
                index > 0 &&
                  "border-t border-white/18 md:border-t-0 md:border-l",
              )}
            >
              <dt className="text-sm font-semibold text-brand-200">
                {statement.label}
              </dt>
              <dd className="type-h4 text-balance">{statement.text}</dd>
            </Reveal>
          ))}
        </dl>

        {visibleStats.length > 0 && (
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {visibleStats.map((stat, index) => (
              <li key={stat.key}>
                <Reveal
                  index={index}
                  className="flex h-full flex-col gap-2.5 rounded-card bg-white/8 px-5 py-7 text-center"
                >
                  <span className="type-stat">
                    <StatNumber value={stat.value ?? 0} />
                    <span className="ml-0.5 align-top text-[0.5em] leading-none">
                      +
                    </span>
                    {stat.key === "years" && (
                      <span className="text-[0.42em] font-semibold">
                        {" "}
                        {t("stats.yearsUnit")}
                      </span>
                    )}
                  </span>
                  <span className="text-[15px] text-brand-200">
                    {t(`stats.${stat.key}`)}
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
