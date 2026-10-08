"use client";

import { LOCALES } from "@cosmo/shared";
import { Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_LABELS } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { CONTACT_HREF, SITE_NAV } from "./site-nav";

export function MobileMenu() {
  const t = useTranslations();
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={t("header.openMenu")}
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>{t("header.menu")}</SheetTitle>
        </SheetHeader>

        <nav className="grid gap-1 px-4">
          {SITE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              className="rounded-2xl px-4 py-3 text-2xl font-semibold tracking-tight text-foreground/75 transition-colors duration-150 hover:bg-muted hover:text-foreground aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="mt-auto grid gap-6 p-4">
          <div
            role="group"
            aria-label={t("header.language")}
            className="grid grid-cols-3 gap-1 rounded-full bg-muted p-1"
          >
            {LOCALES.map((locale) => (
              <button
                key={locale}
                type="button"
                lang={locale}
                aria-pressed={locale === currentLocale}
                onClick={() => {
                  close();
                  router.replace(pathname, { locale });
                }}
                className={cn(
                  "rounded-full py-2 text-sm font-medium transition-colors duration-150",
                  locale === currentLocale
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {LOCALE_LABELS[locale]}
              </button>
            ))}
          </div>
          <Button
            size="lg"
            className="h-12 rounded-full"
            nativeButton={false}
            render={<Link href={CONTACT_HREF} onClick={close} />}
          >
            {t("nav.contact")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
