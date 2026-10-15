"use client";

import { ArrowUpRight, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { siteButtonClass } from "./site-button";
import { CONTACT_HREF, SITE_NAV } from "./site-nav";

export function MobileMenu() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        aria-label={t("header.openMenu")}
        className="flex size-11 items-center justify-center text-ink transition-colors duration-150 hover:bg-brand-100 group-data-[over-hero=true]/header:text-white group-data-[over-hero=true]/header:hover:bg-white/15 lg:hidden"
      >
        <Menu className="size-6" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full gap-0 rounded-none border-l-2 border-rule bg-paper text-ink sm:max-w-sm"
      >
        <SheetHeader className="h-16 justify-center border-b-2 border-rule px-4">
          <SheetTitle className="eyebrow text-ink-3">
            {t("header.menu")}
          </SheetTitle>
        </SheetHeader>

        <nav className="grid">
          {SITE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              className="border-b-2 border-rule px-4 py-5 text-2xl font-semibold tracking-heading transition-colors duration-150 hover:bg-brand-100 hover:text-brand-700 aria-[current=page]:text-brand-700"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="mt-auto grid gap-4 p-4">
          <LanguageSwitcher className="-mx-1.5" />
          <Link
            href={CONTACT_HREF}
            onClick={close}
            className={siteButtonClass("primary")}
          >
            {t("nav.contact")}
            <ArrowUpRight className="size-4.5" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
