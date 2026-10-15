"use client";

import { ArrowUpRight } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import { siteButtonClass } from "./site-button";
import { CONTACT_HREF, HERO_MEDIA_ID, SITE_NAV } from "./site-nav";
import { Wordmark } from "./wordmark";

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const [isPastHero, setIsPastHero] = useState(false);

  useMotionValueEvent(scrollY, "change", () => {
    const hero = document.getElementById(HERO_MEDIA_ID);
    const headerHeight = headerRef.current?.offsetHeight ?? 0;

    setIsPastHero(
      hero ? hero.getBoundingClientRect().bottom <= headerHeight : false,
    );
  });

  const isOverHero = pathname === "/" && !isPastHero;

  return (
    <header
      ref={headerRef}
      data-over-hero={isOverHero}
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "group/header sticky top-0 z-40 border-b-2 transition-[background-color,border-color] duration-300 ease-out",
        isOverHero ? "border-transparent bg-transparent" : "border-rule bg-paper",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[180%] bg-linear-to-b from-black/45 to-transparent transition-opacity duration-300 ease-out",
          isOverHero ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="site-container relative grid h-16 grid-cols-[1fr_auto] items-center gap-6 lg:h-21 lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          aria-label={t("header.homeLabel")}
          className="justify-self-start"
        >
          <Wordmark className="text-2xl transition-colors duration-300 group-data-[over-hero=true]/header:text-white lg:text-[30px]" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {SITE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              className="px-4 py-3 text-[15px] font-semibold text-ink transition-colors duration-150 hover:bg-brand-100 hover:text-brand-700 aria-[current=page]:text-brand-700 aria-[current=page]:shadow-[inset_0_-4px_0_var(--color-brand)] group-data-[over-hero=true]/header:text-white group-data-[over-hero=true]/header:hover:bg-white/15"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-5">
          <LanguageSwitcher className="hidden lg:flex" />
          <Link
            href={CONTACT_HREF}
            className={siteButtonClass(
              "primary",
              "hidden h-11.5 min-w-47.5 lg:inline-flex",
            )}
          >
            {t("nav.contact")}
            <ArrowUpRight className="size-4.5" />
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
