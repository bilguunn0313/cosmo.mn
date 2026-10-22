"use client";

import { LOCALES } from "@cosmo/shared";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LOCALE_LABELS, LOCALE_SHORT_LABELS } from "@/lib/translations";
import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  light: "text-ink-3 hover:text-brand-700 aria-[current=true]:text-ink",
  dark: "text-white/75 hover:text-white aria-[current=true]:text-white",
} as const;

interface LanguageSwitcherProps {
  tone?: keyof typeof TONE_CLASSES;
  className?: string;
}

export function LanguageSwitcher({
  tone = "light",
  className,
}: LanguageSwitcherProps) {
  const t = useTranslations("header");
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("language")}
      className={cn("flex items-center text-[13px] font-semibold", className)}
    >
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          lang={locale}
          title={LOCALE_LABELS[locale]}
          aria-current={locale === currentLocale ? "true" : undefined}
          className={cn(
            "px-1.5 py-2 whitespace-nowrap transition-colors duration-150",
            TONE_CLASSES[tone],
          )}
        >
          {LOCALE_SHORT_LABELS[locale]}
        </Link>
      ))}
    </nav>
  );
}
