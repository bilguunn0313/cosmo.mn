import { getTranslations } from "next-intl/server";
import {
  BanknoteIcon,
  CalendarCheckIcon,
  CelebrationIcon,
  ClockIcon,
  GiftIcon,
  HealthIcon,
  SoupIcon,
  TrophyIcon,
  VolleyballIcon,
} from "@/components/site/brand-icons";
import { Reveal } from "@/components/site/reveal";

const BENEFITS = [
  { key: "health", icon: HealthIcon },
  { key: "salary", icon: BanknoteIcon },
  { key: "performance", icon: TrophyIcon },
  { key: "paidLeave", icon: CalendarCheckIcon },
  { key: "holidays", icon: GiftIcon },
  { key: "sports", icon: VolleyballIcon },
  { key: "events", icon: CelebrationIcon },
  { key: "flexibleHours", icon: ClockIcon },
  { key: "mealTransport", icon: SoupIcon },
] as const;

export async function HrBenefitsSection() {
  const t = await getTranslations("careers.benefits");

  return (
    <section aria-labelledby="hr-benefits-title" className="pt-20 md:pt-32">
      <div className="site-container">
        <div className="rounded-[32px] bg-brand-100 p-4 sm:p-8 lg:p-10 xl:p-14">
          <Reveal>
            <h2
              id="hr-benefits-title"
              className="mb-6 pt-2 type-section text-center text-balance text-ink sm:pt-0 md:mb-10"
            >
              {t("title")}
            </h2>
          </Reveal>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
            {BENEFITS.map(({ key, icon: Icon }, index) => (
              <li key={key} className="flex last:col-span-2 sm:last:col-span-1">
                <Reveal
                  index={index}
                  className="flex w-full flex-col items-center gap-4 rounded-card bg-white px-4 pt-7 pb-6 text-center md:gap-5 md:px-5 md:pt-9 md:pb-7 lg:flex-row lg:p-6 lg:text-left"
                >
                  <Icon className="size-12 shrink-0 md:size-14" />
                  <h3 className="text-[15px] leading-snug font-medium text-balance text-ink md:text-base">
                    {t(`items.${key}`)}
                  </h3>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
