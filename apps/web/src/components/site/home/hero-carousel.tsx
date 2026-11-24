"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/site/logo-mark";
import { useSlideCarousel } from "@/components/site/use-slide-carousel";
import { imageFrameStyle } from "@/lib/image-frame";
import type { PublicSlide } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 4000;

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
      style={imageFrameStyle(slide.mediaUrl)}
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
      className="flex size-12 items-center justify-center rounded-full bg-white text-brand-700 transition-[background-color,scale] duration-150 ease-out hover:bg-brand-100 motion-safe:active:scale-[0.97]"
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
  const [isMuted, setIsMuted] = useState(true);

  const count = slides.length;
  const isPlaying = hasMany && !shouldReduceMotion && !isBusy;
  const activeSlide = slides[activeIndex];
  const isVideoActive = activeSlide.mediaType === "VIDEO";

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = setTimeout(() => goBy(1), SLIDE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isPlaying, activeIndex, goBy]);

  return (
    <div
      ref={viewportRef}
      aria-roledescription="carousel"
      aria-label={t("home.carousel")}
      className="absolute inset-0 overflow-hidden"
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

      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 md:bottom-8">
        <div className="site-container flex min-h-12 items-center justify-between gap-4">
          {hasMany ? (
            <div
              role="group"
              aria-label={t("home.slideIndicators")}
              className="pointer-events-auto -ml-2 flex items-center"
            >
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={t("home.goToSlide", { number: index + 1 })}
                  aria-current={index === activeIndex}
                  onClick={() => goTo(index, index > activeIndex ? 1 : -1)}
                  className="group grid size-9 place-items-center rounded-full outline-white transition-[scale] duration-150 ease-out focus-visible:outline-2 motion-safe:active:scale-[0.95]"
                >
                  {index === activeIndex ? (
                    <LogoMark className="w-5.5 text-white drop-shadow-[0_1px_3px_rgb(11_31_51/0.4)] motion-safe:animate-in motion-safe:duration-200 motion-safe:ease-out motion-safe:zoom-in-90 motion-safe:fade-in" />
                  ) : (
                    <span className="size-2 rounded-full bg-white/55 transition-colors duration-150 group-hover:bg-white" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}

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
  );
}
