"use client";

import { LOCALES } from "@cosmo/shared";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_LABELS } from "@/lib/translations";

export function LanguageSwitcher() {
  const t = useTranslations("header");
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-11 gap-1.5 rounded-full px-3.5 text-[15px]"
            aria-label={t("language")}
          />
        }
      >
        <Globe />
        <span className="uppercase">{currentLocale}</span>
        <ChevronDown className="size-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale}
            lang={locale}
            onClick={() => router.replace(pathname, { locale })}
          >
            {LOCALE_LABELS[locale]}
            {locale === currentLocale && <Check className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
