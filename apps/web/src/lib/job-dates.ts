import { toCompanyDate } from "@cosmo/shared";

const DAY_MS = 24 * 60 * 60 * 1000;
const SOON_DAYS = 7;

function companyDayNumber(value: Date | string) {
  return Date.parse(`${toCompanyDate(value)}T00:00:00Z`) / DAY_MS;
}

export function formatJobDate(isoDate: string) {
  return toCompanyDate(isoDate).replaceAll("-", ".");
}

export function daysLeft(closesAt: string, now: Date) {
  return Math.max(0, companyDayNumber(closesAt) - companyDayNumber(now));
}

export function isClosingSoon(days: number) {
  return days <= SOON_DAYS;
}
