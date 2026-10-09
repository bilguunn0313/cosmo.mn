import { getTranslations } from "next-intl/server";
import type { PublicBrand, PublicSiteSetting } from "@/lib/public-api";
import { cn } from "@/lib/utils";
import { StatNumber } from "./stat-number";

const COLUMN_CLASSES: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

interface Stat {
  key: string;
  value: number;
  suffix: string;
  label: string;
}

interface StatsSectionProps {
  setting: PublicSiteSetting | null;
  brands: PublicBrand[];
}

export async function StatsSection({ setting, brands }: StatsSectionProps) {
  const t = await getTranslations("home");
  const currentYear = new Date().getFullYear();

  const candidates: (Stat | null)[] = [
    setting?.foundedYear
      ? {
          key: "years",
          value: currentYear - setting.foundedYear,
          suffix: "+",
          label: t("statYears"),
        }
      : null,
    setting?.employeeCount
      ? {
          key: "employees",
          value: setting.employeeCount,
          suffix: "+",
          label: t("statEmployees"),
        }
      : null,
    brands.length > 0
      ? {
          key: "brands",
          value: brands.length,
          suffix: "",
          label: t("statBrands"),
        }
      : null,
    setting?.partnerCount
      ? {
          key: "partners",
          value: setting.partnerCount,
          suffix: "+",
          label: t("statPartners"),
        }
      : null,
  ];
  const stats = candidates.filter((stat): stat is Stat => stat !== null);

  if (stats.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="stats-title"
      className="site-container-wide py-6 md:py-10"
    >
      <h2 id="stats-title" className="sr-only">
        {t("statsTitle")}
      </h2>
      <dl
        className={cn(
          "grid gap-y-12 lg:divide-x",
          COLUMN_CLASSES[stats.length],
        )}
      >
        {stats.map((stat) => (
          <div key={stat.key} className="grid gap-2 px-4 text-center lg:px-8">
            <dt className="order-2 text-base text-muted-foreground md:text-lg">
              {stat.label}
            </dt>
            <dd className="order-1 text-5xl font-semibold tracking-tight text-primary tabular-nums md:text-6xl">
              <StatNumber value={stat.value} suffix={stat.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
