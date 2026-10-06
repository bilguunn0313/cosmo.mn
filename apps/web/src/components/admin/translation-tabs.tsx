"use client";

import { LOCALES } from "@cosmo/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LOCALE_LABELS } from "@/lib/translations";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/types";

interface TranslationTabsProps {
  hasError: (locale: Locale) => boolean;
  isFilled: (locale: Locale) => boolean;
  children: (locale: Locale) => React.ReactNode;
}

export function TranslationTabs({
  hasError,
  isFilled,
  children,
}: TranslationTabsProps) {
  return (
    <Tabs defaultValue="mn" className="gap-4">
      <div className="grid gap-1.5">
        <TabsList className="w-full">
          {LOCALES.map((locale) => (
            <TabsTrigger key={locale} value={locale} className="gap-1.5">
              {LOCALE_LABELS[locale]}
              {locale === "mn" && <span className="text-destructive">*</span>}
              <span
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full",
                  hasError(locale)
                    ? "bg-destructive"
                    : isFilled(locale)
                      ? "bg-emerald-500"
                      : "bg-transparent",
                )}
              />
            </TabsTrigger>
          ))}
        </TabsList>
        <p className="text-xs text-muted-foreground">
          Монгол хэл заавал. Англи, хятад орчуулгыг хоосон үлдээвэл тухайн хэл
          дээр монгол текст харагдана.
        </p>
      </div>
      {LOCALES.map((locale) => (
        <TabsContent
          key={locale}
          value={locale}
          keepMounted
          className="grid gap-4"
        >
          {children(locale)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
