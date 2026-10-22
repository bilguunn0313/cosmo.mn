import { getTranslations } from "next-intl/server";
import {
  BrandsIcon,
  DistributionIcon,
  GrowthIcon,
  TeamIcon,
} from "@/components/site/brand-icons";
import type { PublicBrand, PublicSiteSetting } from "@/lib/public-api";

export interface Stat {
  key: string;
  value: number;
  suffix: string;
  label: string;
  icon: (props: { className?: string }) => React.JSX.Element;
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
          icon: GrowthIcon,
        }
      : null,
    setting?.employeeCount
      ? {
          key: "employees",
          value: setting.employeeCount,
          suffix: "+",
          label: t("statEmployees"),
          icon: TeamIcon,
        }
      : null,
    brands.length > 0
      ? {
          key: "brands",
          value: brands.length,
          suffix: "",
          label: t("statBrands"),
          icon: BrandsIcon,
        }
      : null,
    setting?.salesPointCount
      ? {
          key: "salesPoints",
          value: setting.salesPointCount,
          suffix: "+",
          label: t("statSalesPoints"),
          icon: DistributionIcon,
        }
      : null,
  ];

  return candidates.filter((stat): stat is Stat => stat !== null);
}
