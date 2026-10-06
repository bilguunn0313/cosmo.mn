import { DEFAULT_LOCALE, LOCALES } from "@cosmo/shared";
import type { Locale } from "./types";

export const LOCALE_LABELS: Record<Locale, string> = {
  mn: "Монгол",
  en: "English",
  zh: "中文",
};

export type TranslationsForm<T> = Record<Locale, T>;

export function emptyTranslations<T>(empty: T): TranslationsForm<T> {
  return { mn: { ...empty }, en: { ...empty }, zh: { ...empty } };
}

export function translationsToForm<T extends Record<string, string>>(
  translations: ({ locale: Locale } & Record<keyof T, string | null>)[],
  empty: T,
): TranslationsForm<T> {
  const form = emptyTranslations(empty);

  for (const translation of translations) {
    const values = { ...empty };

    for (const key of Object.keys(empty) as (keyof T)[]) {
      values[key] = (translation[key] ?? "") as T[keyof T];
    }

    form[translation.locale] = values;
  }

  return form;
}

export function pickDefaultTranslation<T extends { locale: Locale }>(
  translations: T[],
) {
  return translations.find(
    (translation) => translation.locale === DEFAULT_LOCALE,
  );
}

export function isTranslationFilled(values: Record<string, string>) {
  return Object.values(values).some((value) => value.trim() !== "");
}

function withoutEmptyValues(values: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(values)
      .map(([key, value]) => [key, value.trim()])
      .filter(([, value]) => value !== ""),
  );
}

export function formToTranslations<T extends Record<string, string>>(
  form: TranslationsForm<T>,
) {
  return LOCALES.filter(
    (locale) => locale === DEFAULT_LOCALE || isTranslationFilled(form[locale]),
  ).map((locale) => ({ locale, ...withoutEmptyValues(form[locale]) }));
}
