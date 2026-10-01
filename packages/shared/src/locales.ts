import { z } from "zod";

export const LOCALES = ["mn", "en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "mn";

export const localeSchema = z.enum(LOCALES).default(DEFAULT_LOCALE);
