"use client";

import { Menu } from "@base-ui/react/menu";
import { LOCALES } from "@cosmo/shared";
import CN from "country-flag-icons/react/3x2/CN";
import GB from "country-flag-icons/react/3x2/GB";
import MN from "country-flag-icons/react/3x2/MN";
import { Check, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LOCALE_LABELS } from "@/lib/translations";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

const LOCALE_FLAGS = { mn: MN, en: GB, zh: CN } as const;

const TRIGGER_TONE_CLASSES = {
  light:
    "text-ink-2 hover:bg-brand-100 hover:text-brand-700 data-popup-open:bg-brand-100 data-popup-open:text-brand-700",
  dark: "text-white/85 hover:bg-white/10 hover:text-white data-popup-open:bg-white/10 data-popup-open:text-white",
} as const;

interface LocaleFlagProps {
  locale: Locale;
}

function LocaleFlag({ locale }: LocaleFlagProps) {
  const Flag = LOCALE_FLAGS[locale];

  return (
    <Flag
      aria-hidden
      className="h-4 w-6 shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgb(0_0_0/0.08)]"
    />
  );
}

interface LanguageMenuProps {
  tone?: keyof typeof TRIGGER_TONE_CLASSES;
}

export function LanguageMenu({ tone = "light" }: LanguageMenuProps) {
  const t = useTranslations("header");
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`${t("language")}: ${LOCALE_LABELS[currentLocale]}`}
        className={cn(
          "group flex h-10 items-center gap-1.5 rounded-control px-2.5 transition-colors duration-150",
          TRIGGER_TONE_CLASSES[tone],
        )}
      >
        <LocaleFlag locale={currentLocale} />
        <ChevronDown
          aria-hidden
          className="size-3.5 transition-transform duration-200 ease-(--ease-out) group-data-popup-open:rotate-180"
        />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={8} className="z-50">
          <Menu.Popup className="min-w-44 origin-(--transform-origin) rounded-[14px] bg-white p-1.5 shadow-[0_0_0_1px_var(--color-rule),0_16px_40px_-16px_color-mix(in_srgb,var(--color-brand-night)_40%,transparent)] transition-[opacity,scale] duration-150 ease-(--ease-out) outline-none data-ending-style:scale-96 data-ending-style:opacity-0 data-starting-style:scale-96 data-starting-style:opacity-0 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100">
            {LOCALES.map((locale) => {
              const isCurrent = locale === currentLocale;

              return (
                <Menu.LinkItem
                  key={locale}
                  closeOnClick
                  render={<Link href={pathname} locale={locale} />}
                  lang={locale}
                  hrefLang={locale}
                  aria-current={isCurrent ? "true" : undefined}
                  className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-semibold text-ink outline-none data-highlighted:bg-brand-100 data-highlighted:text-brand-700"
                >
                  <LocaleFlag locale={locale} />
                  <span className="flex-1">{LOCALE_LABELS[locale]}</span>
                  {isCurrent && (
                    <Check aria-hidden className="size-4 text-brand" />
                  )}
                </Menu.LinkItem>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
