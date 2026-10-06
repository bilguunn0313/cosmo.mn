import type { BrandCategory } from "./types";

export const BRAND_CATEGORY_LABELS: Record<BrandCategory, string> = {
  FOOD: "Хүнс",
  BEAUTY: "Гоо сайхан",
  HOUSEHOLD: "Ахуй бараа",
};

export function categoriesLabel(categories: BrandCategory[]) {
  return categories
    .map((category) => BRAND_CATEGORY_LABELS[category])
    .join(", ");
}
