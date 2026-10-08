"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import { CONTACT_HREF, SITE_NAV } from "./site-nav";
import { Wordmark } from "./wordmark";

const SCROLLED_OFFSET_PX = 8;

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) =>
    setIsScrolled(value > SCROLLED_OFFSET_PX),
  );

  return (
    <header
      data-scrolled={isScrolled}
      style={{ viewTransitionName: "site-header" }}
      className="glass sticky top-0 z-40 border-b border-transparent transition-[border-color] duration-200 ease-(--ease-out) data-[scrolled=true]:border-border/60"
    >
      <div className="site-container-wide grid h-16 grid-cols-[1fr_auto] items-center gap-6 lg:h-20 lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          aria-label={t("header.homeLabel")}
          className="justify-self-start"
        >
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {SITE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              className="inline-flex h-11 items-center rounded-full px-5 text-[15px] font-medium text-foreground/75 transition-[background-color,color,scale] duration-150 ease-(--ease-out) hover:bg-muted hover:text-foreground motion-safe:active:scale-[0.97] aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          <LanguageSwitcher />
          <Button
            className="hidden h-11 rounded-full px-6 text-[15px] lg:inline-flex"
            nativeButton={false}
            render={<Link href={CONTACT_HREF} />}
          >
            {t("nav.contact")}
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
