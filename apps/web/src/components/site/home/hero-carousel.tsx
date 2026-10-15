"use client";

import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
// import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { PanInfo } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
// import { siteButtonClass } from "@/components/site/site-button";
import { HERO_MEDIA_ID } from "@/components/site/site-nav";
// import { SmartLink } from "@/components/site/smart-link";
import type { PublicSlide } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 7000;
const SWIPE_THRESHOLD_PX = 50;
const SWIPE_VELOCITY_PX = 500;

function swipeStep({ offset, velocity }: PanInfo) {
  const isFlick = Math.abs(velocity.x) > SWIPE_VELOCITY_PX;

  if (!isFlick && Math.abs(offset.x) <= SWIPE_THRESHOLD_PX) {
    return 0;
  }

  const direction = isFlick ? velocity.x : offset.x;

  return direction < 0 ? 1 : -1;
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

function ArrowButton({ label, onClick, className, children }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 hidden size-14 -translate-y-1/2 items-center justify-center border-2 border-white/60 text-white transition-colors duration-150 hover:bg-white/15 md:flex",
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const hasMany = slides.length > 1;
  const isPlaying = hasMany && !shouldReduceMotion;
  const activeSlide = slides[activeIndex];
  const isVideoActive = activeSlide.mediaType === "VIDEO";

  const goTo = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  const handlePanEnd = (info: PanInfo) => {
    const step = hasMany ? swipeStep(info) : 0;

    if (step !== 0) {
      goTo(activeIndex + step);
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("home.carousel")}
      className="-mt-16 lg:-mt-21"
    >
      <motion.div
        id={HERO_MEDIA_ID}
        onPanEnd={(_, info) => handlePanEnd(info)}
        className="relative h-[80svh] min-h-105 touch-pan-y overflow-hidden bg-brand-night lg:h-svh"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={t("home.slideLabel", {
              current: index + 1,
              total: slides.length,
            })}
            aria-hidden={index !== activeIndex}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              index === activeIndex ? "opacity-100" : "opacity-0",
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
        ))}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/50 to-transparent"
        />

        {hasMany && (
          <>
            <ArrowButton
              label={t("home.previous")}
              onClick={() => goTo(activeIndex - 1)}
              className="left-4 md:left-6"
            >
              <ChevronLeft className="size-6" />
            </ArrowButton>
            <ArrowButton
              label={t("home.next")}
              onClick={() => goTo(activeIndex + 1)}
              className="right-4 md:right-6"
            >
              <ChevronRight className="size-6" />
            </ArrowButton>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0">
          <div className="site-container grid gap-3 pb-3 md:pb-5">
            <div className="flex items-end justify-end gap-4">
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
              )}
            </div>

            {hasMany && (
              <div className="flex gap-2 md:gap-6">
                {slides.map((slide, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={t("home.goToSlide", { number: index + 1 })}
                      aria-current={isActive}
                      onClick={() => goTo(index)}
                      className="group flex-1 py-3"
                    >
                      <span className="relative block h-1 overflow-hidden bg-white/35 transition-colors duration-150 group-hover:bg-white/55">
                        {isActive && (
                          <span
                            key={activeIndex}
                            onAnimationEnd={() => goTo(activeIndex + 1)}
                            className="absolute inset-0 origin-left bg-white"
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
