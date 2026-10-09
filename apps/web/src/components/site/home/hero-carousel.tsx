"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import type { PanInfo, Variants } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SmartLink } from "@/components/site/smart-link";
import type { PublicSlide } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 7000;
const SWIPE_THRESHOLD_PX = 50;
const SWIPE_VELOCITY_PX = 500;
const DRAG_LIMIT_PX = 80;
const TEXT_ENTER_OFFSET_PX = 16;
const TEXT_EXIT_OFFSET_PX = 8;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

type ChangeSource = "swipe" | "control";

function rubberband(offset: number) {
  return (offset * DRAG_LIMIT_PX) / (DRAG_LIMIT_PX + Math.abs(offset));
}

function swipeStep({ offset, velocity }: PanInfo) {
  const isFlick = Math.abs(velocity.x) > SWIPE_VELOCITY_PX;

  if (!isFlick && Math.abs(offset.x) <= SWIPE_THRESHOLD_PX) {
    return 0;
  }

  const direction = isFlick ? velocity.x : offset.x;

  return direction < 0 ? 1 : -1;
}

function textVariants(shouldReduceMotion: boolean): Variants {
  return {
    hidden: {
      opacity: 0,
      transform: `translateY(${shouldReduceMotion ? 0 : TEXT_ENTER_OFFSET_PX}px)`,
    },
    shown: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: { duration: shouldReduceMotion ? 0.3 : 0.7, ease: EASE_OUT },
    },
    exit: (source: ChangeSource) =>
      source === "swipe"
        ? { opacity: 0, transition: { duration: 0 } }
        : {
            opacity: 0,
            transform: `translateY(${shouldReduceMotion ? 0 : -TEXT_EXIT_OFFSET_PX}px)`,
            transition: { duration: 0.2, ease: EASE_OUT },
          },
  };
}

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
  const [changeSource, setChangeSource] = useState<ChangeSource>("control");
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const dragX = useMotionValue(0);
  const textTransform = useTransform(dragX, (x) => `translateX(${x}px)`);
  const textOpacity = useTransform(
    dragX,
    [-DRAG_LIMIT_PX, 0, DRAG_LIMIT_PX],
    [0.3, 1, 0.3],
  );

  const hasMany = slides.length > 1;
  const isPlaying =
    hasMany && !isHovered && !hasFocusWithin && !shouldReduceMotion;
  const activeSlide = slides[activeIndex];

  const goTo = (index: number, source: ChangeSource = "control") => {
    setChangeSource(source);
    setActiveIndex((index + slides.length) % slides.length);
  };

  const handlePan = (info: PanInfo) => {
    if (hasMany && !shouldReduceMotion) {
      dragX.set(rubberband(info.offset.x));
    }
  };

  const handlePanEnd = (info: PanInfo) => {
    const step = hasMany ? swipeStep(info) : 0;

    if (step === 0) {
      animate(dragX, 0, { type: "spring", duration: 0.4, bounce: 0 });
      return;
    }

    dragX.jump(0);
    goTo(activeIndex + step, "swipe");
  };

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
        onPan={(_, info) => handlePan(info)}
        onPanEnd={(_, info) => handlePanEnd(info)}
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

        <motion.div
          style={{ transform: textTransform, opacity: textOpacity }}
          className="absolute inset-0"
        >
          <AnimatePresence custom={changeSource}>
            <motion.div
              key={activeIndex}
              custom={changeSource}
              variants={textVariants(shouldReduceMotion)}
              initial="hidden"
              animate="shown"
              exit="exit"
              className={cn(
                "absolute inset-x-0 bottom-0 grid max-w-3xl gap-5 p-6 text-white sm:p-10 lg:p-14",
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
            </motion.div>
          </AnimatePresence>
        </motion.div>

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
