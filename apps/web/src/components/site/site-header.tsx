"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { HeaderFacebookLink } from "./header-facebook-link";
import { LanguageMenu } from "./language-menu";
import { MobileMenu } from "./mobile-menu";
import { PAGE_BANNER_ID, SITE_NAV, isNavItemActive } from "./site-nav";
import { Wordmark } from "./wordmark";

const HERO_PATHS = ["/"];

interface SiteHeaderProps {
  facebookUrl: string | null;
}

export function SiteHeader({ facebookUrl }: SiteHeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverBanner, setIsOverBanner] = useState(false);

  const hasHero = HERO_PATHS.includes(pathname);
  const isOverHero = hasHero && !isScrolled;
  const tone = isOverHero ? "dark" : "light";

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
        "top-0 z-40 transition-[translate,box-shadow,background-color] duration-300 ease-out motion-reduce:transition-none",
        hasHero ? "fixed inset-x-0" : "sticky",
        isOverHero
          ? "bg-transparent [--focus-ring:var(--color-white)]"
          : "bg-white",
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
          <Wordmark
            className={cn(
              "text-2xl lg:text-[30px]",
              isOverHero && "text-white",
            )}
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {SITE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                isNavItemActive(item.href, pathname) ? "page" : undefined
              }
              className={cn(
                "px-4 py-3 text-sm font-semibold transition-colors duration-150",
                isOverHero
                  ? "text-brand-200 hover:text-white aria-[current=page]:text-white aria-[current=page]:shadow-[inset_0_-3px_0_white]"
                  : "text-ink hover:bg-brand-100 hover:text-brand-700 aria-[current=page]:text-brand-700 aria-[current=page]:shadow-[inset_0_-4px_0_var(--color-brand)]",
              )}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-1 lg:-mr-2.5">
          <LanguageMenu tone={tone} />
          {facebookUrl && <HeaderFacebookLink url={facebookUrl} tone={tone} />}
          <MobileMenu tone={tone} />
        </div>
      </div>
    </header>
  );
}
