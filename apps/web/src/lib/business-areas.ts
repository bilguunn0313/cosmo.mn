import type { Locale } from "@cosmo/shared";

export const DEFAULT_BUSINESS_AREAS = [
  { key: "import", imageUrl: "/images/home/area-import.webp" },
  { key: "warehouse", imageUrl: "/images/home/area-warehouse.webp" },
  { key: "distribution", imageUrl: "/images/home/area-distribution.webp" },
  { key: "sales", imageUrl: "/images/home/area-sales.webp" },
  { key: "marketing", imageUrl: "/images/home/area-marketing.webp" },
] as const;

export type BusinessAreaKey = (typeof DEFAULT_BUSINESS_AREAS)[number]["key"];

interface BusinessAreaText {
  title: string;
  text: string;
}

export async function loadDefaultAreaTexts(
  locale: Locale,
): Promise<Record<BusinessAreaKey, BusinessAreaText>> {
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return messages.home.areas.items;
}
