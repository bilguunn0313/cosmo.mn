"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SmartLink } from "@/components/site/smart-link";
import type { PublicSlide } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 7000;
const SWIPE_THRESHOLD_PX = 50;

interface SlideMediaProps {
  slide: PublicSlide;
  isActive: boolean;
  isFirst: boolean;
  canAutoplay: boolean;
}

function SlideMedia({
  slide,
  isActive,
  isFirst,
  canAutoplay,
}: SlideMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (isActive && canAutoplay) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isActive, canAutoplay]);

  if (slide.mediaType === "VIDEO") {
    return (
      <video
        ref={videoRef}
        src={slide.mediaUrl}
        poster={slide.posterUrl ?? undefined}
        muted
        loop
        playsInline
        preload={isFirst ? "auto" : "metadata"}
        className="size-full object-cover"
      />
    );
  }

  return (
    <Image
      src={slide.mediaUrl}
      alt=""
      fill
      unoptimized
      priority={isFirst}
      sizes="100vw"
      className="object-cover"
    />
  );
}

interface ArrowButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

function ArrowButton({ label, onClick, children }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="hidden size-12 shrink-0 items-center justify-center rounded-full border bg-background text-foreground transition-[background-color,border-color,scale] duration-150 ease-(--ease-out) hover:border-primary/40 hover:bg-primary/5 hover:text-primary motion-safe:active:scale-[0.94] md:flex"
    >
      {children}
    </button>
  );
}

interface HeroCarouselProps {
  slides: PublicSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const t = useTranslations("home");
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);

  const hasMany = slides.length > 1;
  const isPlaying =
    hasMany && !isHovered && !hasFocusWithin && !shouldReduceMotion;
  const activeSlide = slides[activeIndex];

  const goTo = (index: number) =>
    setActiveIndex((index + slides.length) % slides.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("carousel")}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          setIsHovered(true);
        }
      }}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setHasFocusWithin(false);
        }
      }}
      className="flex items-center gap-4"
    >
      {hasMany && (
        <ArrowButton
          label={t("previous")}
          onClick={() => goTo(activeIndex - 1)}
        >
          <ChevronLeft className="size-5" />
        </ArrowButton>
      )}

      <motion.div
        onPanEnd={(_, info) => {
          if (info.offset.x < -SWIPE_THRESHOLD_PX) {
            goTo(activeIndex + 1);
          } else if (info.offset.x > SWIPE_THRESHOLD_PX) {
            goTo(activeIndex - 1);
          }
        }}
        className="relative h-[clamp(26rem,calc(100dvh-10rem),48rem)] min-w-0 flex-1 touch-pan-y overflow-hidden rounded-3xl bg-muted md:rounded-[2rem]"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={t("slideLabel", {
              current: index + 1,
              total: slides.length,
            })}
            aria-hidden={index !== activeIndex}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-(--ease-in-out)",
              index === activeIndex ? "opacity-100" : "opacity-0",
            )}
          >
            <SlideMedia
              slide={slide}
              isActive={index === activeIndex}
              isFirst={index === 0}
              canAutoplay={!shouldReduceMotion}
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        <div
          key={activeIndex}
          className={cn(
            "absolute inset-x-0 bottom-0 grid max-w-3xl gap-5 p-6 text-white motion-safe:animate-hero-text-in sm:p-10 lg:p-14",
            hasMany && "pb-16 sm:pb-20 lg:pb-24",
          )}
        >
          {activeSlide.title && (
            <h2 className="line-clamp-3 text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:line-clamp-2 sm:text-5xl lg:text-6xl">
              {activeSlide.title}
            </h2>
          )}
          {activeSlide.subtitle && (
            <p className="line-clamp-3 max-w-xl text-base text-white/85 sm:text-lg">
              {activeSlide.subtitle}
            </p>
          )}
          {activeSlide.linkUrl && (
            <SmartLink
              href={activeSlide.linkUrl}
              className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-foreground transition-[background-color,scale] duration-150 ease-(--ease-out) hover:bg-white/90 motion-safe:active:scale-[0.97]"
            >
              {activeSlide.buttonText ?? t("learnMore")}
              <ArrowUpRight className="size-4" />
            </SmartLink>
          )}
        </div>

        {hasMany && (
          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-1 sm:bottom-7">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={t("goToSlide", { number: index + 1 })}
                aria-current={index === activeIndex}
                onClick={() => goTo(index)}
                className="group flex h-6 items-center px-1"
              >
                <span className="relative block h-1 w-8 overflow-hidden rounded-full bg-white/35 transition-colors duration-150 group-hover:bg-white/55">
                  {index === activeIndex && (
                    <span
                      key={activeIndex}
                      onAnimationEnd={() => goTo(activeIndex + 1)}
                      className="absolute inset-0 origin-left rounded-full bg-white"
                      style={
                        shouldReduceMotion
                          ? undefined
                          : {
                              animation: `carousel-progress ${SLIDE_DURATION_MS}ms linear both`,
                              animationPlayState: isPlaying
                                ? "running"
                                : "paused",
                            }
                      }
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {hasMany && (
        <ArrowButton label={t("next")} onClick={() => goTo(activeIndex + 1)}>
          <ChevronRight className="size-5" />
        </ArrowButton>
      )}
    </section>
  );
}
