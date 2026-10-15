"use client";

import { LOCALES } from "@cosmo/shared";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LOCALE_LABELS, LOCALE_SHORT_LABELS } from "@/lib/translations";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
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
          className="px-1.5 py-2 whitespace-nowrap text-ink-3 transition-colors duration-150 hover:text-brand-700 aria-[current=true]:text-ink group-data-[over-hero=true]/header:text-white/70 group-data-[over-hero=true]/header:hover:text-white group-data-[over-hero=true]/header:aria-[current=true]:text-white"
        >
          {LOCALE_SHORT_LABELS[locale]}
        </Link>
      ))}
    </nav>
  );
}
