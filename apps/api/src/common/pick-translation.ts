import { DEFAULT_LOCALE } from '@cosmo/shared';
import type { Locale } from '@cosmo/shared';

export function pickTranslation<T extends { locale: string }>(
  translations: T[],
  locale: Locale,
): T | undefined {
  return (
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === DEFAULT_LOCALE)
  );
}
