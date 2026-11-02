import type { PublicSiteSetting } from "./public-api";
import type { Locale } from "./types";

export interface HomeStats {
  foundedYear: string | null;
  years: string | null;
  salesPoints: string | null;
  products: string | null;
  team: string | null;
}

export function homeStats(
  setting: PublicSiteSetting | null,
  locale: Locale,
): HomeStats {
  const numberFormat = new Intl.NumberFormat(locale);
  const format = (value: number | null | undefined) =>
    value ? numberFormat.format(value) : null;
  const foundedYear = setting?.foundedYear ?? null;

  return {
    foundedYear: foundedYear ? String(foundedYear) : null,
    years: foundedYear ? String(new Date().getFullYear() - foundedYear) : null,
    salesPoints: format(setting?.salesPointCount),
    products: format(setting?.productCount),
    team: format(setting?.employeeCount),
  };
}
