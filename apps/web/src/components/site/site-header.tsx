"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import { PAGE_BANNER_ID, SITE_NAV, isNavItemActive } from "./site-nav";
import { Wordmark } from "./wordmark";

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverBanner, setIsOverBanner] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const banner = document.getElementById(PAGE_BANNER_ID);

    setIsScrolled(latest > 0);
    setIsOverBanner(
      banner ? latest > 0 && banner.getBoundingClientRect().bottom > 0 : false,
    );
  });

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "sticky top-0 z-40 bg-white transition-[translate,box-shadow] duration-300 ease-out motion-reduce:transition-none",
        isScrolled &&
          "shadow-[0_1px_0_var(--color-rule),0_12px_32px_-16px_color-mix(in_srgb,var(--color-brand-night)_35%,transparent)]",
        isOverBanner && "-translate-y-full focus-within:translate-y-0",
      )}
    >
      <div className="site-container relative grid h-16 grid-cols-[1fr_auto] items-center gap-6 lg:h-21 lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          aria-label={t("header.homeLabel")}
          className="justify-self-start"
        >
          <Wordmark className="text-2xl lg:text-[30px]" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {SITE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                isNavItemActive(item.href, pathname) ? "page" : undefined
              }
              className="px-4 py-3 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-brand-100 hover:text-brand-700 aria-[current=page]:text-brand-700 aria-[current=page]:shadow-[inset_0_-4px_0_var(--color-brand)]"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-5">
          <LanguageSwitcher className="hidden lg:flex" />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
