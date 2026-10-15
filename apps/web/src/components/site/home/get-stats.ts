import { getTranslations } from "next-intl/server";
import type { PublicBrand, PublicSiteSetting } from "@/lib/public-api";

export interface Stat {
  key: string;
  value: number;
  suffix: string;
  label: string;
}

export async function getStats(
  setting: PublicSiteSetting | null,
  brands: PublicBrand[],
) {
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
    setting?.salesPointCount
      ? {
          key: "salesPoints",
          value: setting.salesPointCount,
          suffix: "+",
          label: t("statSalesPoints"),
        }
      : null,
  ];

  return candidates.filter((stat): stat is Stat => stat !== null);
}
