"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useSlideCarousel } from "@/components/site/use-slide-carousel";
import { imageFrameStyle } from "@/lib/image-frame";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 5000;
const TAB_SCROLL_MARGIN = 16;

export interface BrandSlide {
  slug: string;
  name: string;
  imageUrl: string;
  ratio: number;
}

interface BrandsHeroCarouselProps {
  slides: BrandSlide[];
  children: React.ReactNode;
}

export function BrandsHeroCarousel({
  slides,
  children,
}: BrandsHeroCarouselProps) {
  const t = useTranslations();
  const tabsRef = useRef<HTMLDivElement>(null);
  const {
    viewportRef,
    activeIndex,
    hasMany,
    shouldReduceMotion,
    isBusy,
    positionOf,
    goTo,
    goBy,
    trackProps,
  } = useSlideCarousel(slides.length);

  const activeSlide = slides[activeIndex];
  const isPlaying = hasMany && !shouldReduceMotion && !isBusy;

  useEffect(() => {
    const group = tabsRef.current;
    const tab = group?.children[activeIndex];

    if (!group || !(tab instanceof HTMLElement)) {
      return;
    }

    if (group.scrollWidth > group.clientWidth) {
      group.scrollTo({
        left: tab.offsetLeft - TAB_SCROLL_MARGIN,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    }
  }, [activeIndex, shouldReduceMotion]);

  return (
    <div className="@container relative max-md:pt-16 md:h-svh md:min-h-152">
      <div
        ref={viewportRef}
        aria-roledescription="carousel"
        aria-label={t("nav.brands")}
        style={{ "--slide-ratio": activeSlide.ratio } as React.CSSProperties}
        className="relative overflow-hidden max-md:h-[calc(100cqw/var(--slide-ratio))] max-md:transition-[height] max-md:duration-700 max-md:ease-(--ease-drawer) motion-reduce:transition-none md:absolute md:inset-0"
      >
        <motion.div
          {...trackProps}
          className={cn(
            "absolute inset-0 touch-pan-y select-none",
            hasMany && "cursor-grab active:cursor-grabbing",
          )}
        >
          {slides.map((slide, index) => {
            const position = positionOf(index);

            return (
              <div
                key={slide.slug}
                role="group"
                aria-roledescription="slide"
                aria-label={slide.name}
                aria-hidden={index !== activeIndex}
                style={{ translate: `${(position ?? 0) * 100}% 0` }}
                className={cn(
                  "absolute inset-0",
                  position === null && "invisible",
                )}
              >
                <Image
                  src={slide.imageUrl}
                  style={imageFrameStyle(slide.imageUrl)}
                  alt=""
                  fill
                  unoptimized
                  draggable={false}
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            );
          })}
        </motion.div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 hidden h-50 bg-linear-to-b from-brand-night/70 via-brand-night/30 via-55% to-brand-night/0 md:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden bg-linear-to-t from-brand-night/88 via-brand-night/45 via-30% to-brand-night/0 to-60% md:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden bg-linear-to-r from-brand-night/50 to-brand-night/0 to-55% lg:block"
        />
      </div>

      <div
        className={cn(
          "site-container pointer-events-none relative pt-8 md:absolute md:inset-x-0 md:bottom-0 md:pt-0",
          !hasMany && "pb-10 md:pb-14",
        )}
      >
        <div className="max-w-130">{children}</div>

        {hasMany && (
          <div
            ref={tabsRef}
            role="group"
            aria-label={t("home.slideIndicators")}
            className="pointer-events-auto relative -mx-4 mt-8 flex gap-7 overflow-x-auto border-t border-white/25 px-4 [scrollbar-width:none] md:mx-0 md:mt-10 md:gap-9 md:px-0"
          >
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={slide.slug}
                  type="button"
                  aria-current={isActive}
                  onClick={() => goTo(index, index > activeIndex ? 1 : -1)}
                  className="relative shrink-0 pt-4 pb-6 font-display text-[15px] font-medium whitespace-nowrap text-white/60 outline-offset-2 outline-white transition-colors duration-200 hover:text-white focus-visible:outline-2 aria-[current=true]:text-white md:pt-5 md:pb-9 md:text-base"
                >
                  {slide.name}
                  {isActive && (
                    <span
                      data-playing={isPlaying}
                      onAnimationEnd={() => goBy(1)}
                      style={{ animationDuration: `${SLIDE_DURATION_MS}ms` }}
                      className="brands-hero-progress absolute inset-x-0 -top-px h-0.5 rounded-full bg-white"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
