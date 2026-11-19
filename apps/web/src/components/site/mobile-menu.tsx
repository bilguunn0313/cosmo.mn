"use client";

import { Menu } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { SITE_NAV, isNavItemActive } from "./site-nav";

const TRIGGER_TONE_CLASSES = {
  light: "text-ink hover:bg-brand-100",
  dark: "text-white hover:bg-white/10",
} as const;

interface MobileMenuProps {
  tone?: keyof typeof TRIGGER_TONE_CLASSES;
}

export function MobileMenu({ tone = "light" }: MobileMenuProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        aria-label={t("header.openMenu")}
        className={cn(
          "flex size-11 items-center justify-center transition-colors duration-150 lg:hidden",
          TRIGGER_TONE_CLASSES[tone],
        )}
      >
        <Menu className="size-6" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full gap-0 rounded-none border-l border-rule bg-white text-ink sm:max-w-sm"
      >
        <SheetHeader className="h-16 justify-center border-b border-rule px-4">
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
              aria-current={
                isNavItemActive(item.href, pathname) ? "page" : undefined
              }
              className="border-b border-rule px-4 py-5 text-2xl font-semibold tracking-heading transition-colors duration-150 hover:bg-brand-100 hover:text-brand-700 aria-[current=page]:text-brand-700"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
