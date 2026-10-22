"use client";

import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
// import { ArrowRight } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import type { PanInfo } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { siteButtonClass } from "@/components/site/site-button";
// import { SmartLink } from "@/components/site/smart-link";
import type { PublicSlide } from "@/lib/public-api";
import { cn } from "@/lib/utils";
import { HERO_HEIGHT_CLASS } from "./hero-size";

const SLIDE_DURATION_MS = 4000;
const SWIPE_THRESHOLD_PX = 50;
const SWIPE_VELOCITY_PX = 500;
const SLIDE_TRANSITION = { duration: 0.6, ease: [0.32, 0.72, 0, 1] } as const;

type Direction = 1 | -1;

interface PendingSlide {
  index: number;
  direction: Direction;
}

function swipeStep({ offset, velocity }: PanInfo): Direction | 0 {
  const isFlick = Math.abs(velocity.x) > SWIPE_VELOCITY_PX;

  if (!isFlick && Math.abs(offset.x) <= SWIPE_THRESHOLD_PX) {
    return 0;
  }

  const direction = isFlick ? velocity.x : offset.x;

  return direction < 0 ? 1 : -1;
}

interface SlidePositionInput {
  index: number;
  activeIndex: number;
  pending: PendingSlide | null;
  count: number;
  revealSide: Direction;
}

function slidePosition({
  index,
  activeIndex,
  pending,
  count,
  revealSide,
}: SlidePositionInput) {
  if (index === activeIndex) {
    return 0;
  }

  if (pending) {
    return index === pending.index ? pending.direction : null;
  }

  if (count === 2) {
    return revealSide;
  }

  const stepsForward = (index - activeIndex + count) % count;

  if (stepsForward === 1) {
    return 1;
  }

  if (stepsForward === count - 1) {
    return -1;
  }

  return null;
}

interface SlideMediaProps {
  slide: PublicSlide;
  isActive: boolean;
  isFirst: boolean;
  canPlay: boolean;
  isMuted: boolean;
}

function SlideMedia({
  slide,
  isActive,
  isFirst,
  canPlay,
  isMuted,
}: SlideMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (isActive && canPlay) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isActive, canPlay]);

  if (slide.mediaType === "VIDEO") {
    return (
      <video
        ref={videoRef}
        src={slide.mediaUrl}
        poster={slide.posterUrl ?? undefined}
        muted={isMuted}
        loop
        playsInline
        draggable={false}
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
      draggable={false}
      priority={isFirst}
      sizes="100vw"
      className="object-cover"
    />
  );
}

interface MediaButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

function MediaButton({ label, onClick, children }: MediaButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-12 items-center justify-center bg-paper text-ink transition-colors duration-150 hover:bg-brand-100"
    >
      {children}
    </button>
  );
}

interface ArrowButtonProps {
  label: string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}

function ArrowButton({
  label,
  onClick,
  className,
  children,
}: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand-night/25 text-white backdrop-blur-sm transition-[background-color,scale] duration-160 ease-out hover:bg-brand-night/45 active:scale-[0.97] md:flex",
        className,
      )}
    >
      {children}
    </button>
  );
}

interface HeroCarouselProps {
  slides: PublicSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const t = useTranslations();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackX = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pending, setPending] = useState<PendingSlide | null>(null);
  const [revealSide, setRevealSide] = useState<Direction>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const count = slides.length;
  const hasMany = count > 1;
  const isPlaying = hasMany && !shouldReduceMotion && !isDragging && !pending;
  const activeSlide = slides[activeIndex];
  const isVideoActive = activeSlide.mediaType === "VIDEO";

  useMotionValueEvent(trackX, "change", (latest) => {
    const side = latest > 0 ? -1 : 1;

    if (side !== revealSide) {
      setRevealSide(side);
    }
  });

  useEffect(() => {
    if (!pending) {
      return;
    }

    let isCancelled = false;
    const width = viewportRef.current?.offsetWidth ?? 0;
    const controls = animate(
      trackX,
      -pending.direction * width,
      shouldReduceMotion ? { duration: 0 } : SLIDE_TRANSITION,
    );

    controls.then(() => {
      if (!isCancelled) {
        setActiveIndex(pending.index);
        setPending(null);
      }
    });

    return () => {
      isCancelled = true;
      controls.stop();
    };
  }, [pending, shouldReduceMotion, trackX]);

  useLayoutEffect(() => {
    trackX.set(0);
  }, [activeIndex, trackX]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = setTimeout(() => {
      setPending({ index: (activeIndex + 1) % count, direction: 1 });
    }, SLIDE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isPlaying, activeIndex, count]);

  const goTo = (index: number, direction: Direction) => {
    if (pending || index === activeIndex) {
      return;
    }

    setPending({ index, direction });
  };

  const goBy = (step: Direction) => {
    goTo((activeIndex + step + count) % count, step);
  };

  const handleDragEnd = (info: PanInfo) => {
    setIsDragging(false);
    const step = swipeStep(info);

    if (step === 0) {
      animate(trackX, 0, SLIDE_TRANSITION);
      return;
    }

    goBy(step);
  };

  return (
    <section aria-roledescription="carousel" aria-label={t("home.carousel")}>
      <div
        ref={viewportRef}
        className={cn(
          "relative overflow-hidden bg-brand-night",
          HERO_HEIGHT_CLASS,
        )}
      >
        <motion.div
          style={{ x: trackX }}
          drag={hasMany && !pending ? "x" : false}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => handleDragEnd(info)}
          className={cn(
            "absolute inset-0 touch-pan-y select-none",
            hasMany && "cursor-grab active:cursor-grabbing",
          )}
        >
          {slides.map((slide, index) => {
            const position = slidePosition({
              index,
              activeIndex,
              pending,
              count,
              revealSide,
            });

            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={t("home.slideLabel", {
                  current: index + 1,
                  total: count,
                })}
                aria-hidden={index !== activeIndex}
                style={{ translate: `${(position ?? 0) * 100}% 0` }}
                className={cn(
                  "absolute inset-0",
                  position === null && "invisible",
                )}
              >
                <SlideMedia
                  slide={slide}
                  isActive={index === activeIndex}
                  isFirst={index === 0}
                  canPlay={!shouldReduceMotion}
                  isMuted={isMuted}
                />
              </div>
            );
          })}
        </motion.div>

        {hasMany && (
          <>
            <ArrowButton
              label={t("home.previous")}
              onClick={() => goBy(-1)}
              className="left-4 md:left-6"
            >
              <ChevronLeft className="size-8" strokeWidth={1.5} />
            </ArrowButton>
            <ArrowButton
              label={t("home.next")}
              onClick={() => goBy(1)}
              className="right-4 md:right-6"
            >
              <ChevronRight className="size-8" strokeWidth={1.5} />
            </ArrowButton>
          </>
        )}

        {hasMany && (
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center md:bottom-5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={t("home.goToSlide", { number: index + 1 })}
                aria-current={index === activeIndex}
                onClick={() => goTo(index, index > activeIndex ? 1 : -1)}
                className="group grid size-6 place-items-center"
              >
                <span className="size-3 rounded-full border-[1.5px] border-white shadow-[0_1px_4px_rgb(0_0_0/0.35)] transition-colors duration-200 ease-out group-hover:bg-white/50 group-aria-[current=true]:bg-white" />
              </button>
            ))}
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="site-container flex items-end justify-end gap-4 pb-4 md:pb-6">
            {/* {activeSlide.linkUrl ? (
                <SmartLink
                  href={activeSlide.linkUrl}
                  className={siteButtonClass("white", "min-w-55")}
                >
                  {activeSlide.buttonText ?? t("home.learnMore")}
                  <ArrowRight className="size-4.5" />
                </SmartLink>
              ) : (
                <span />
              )} */}

            {isVideoActive && (
              <div className="pointer-events-auto">
                <MediaButton
                  label={isMuted ? t("home.unmute") : t("home.mute")}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <VolumeX className="size-5" />
                  ) : (
                    <Volume2 className="size-5" />
                  )}
                </MediaButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
