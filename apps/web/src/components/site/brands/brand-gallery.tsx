"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { useSlideCarousel } from "@/components/site/use-slide-carousel";
import { imageFrameStyle } from "@/lib/image-frame";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 5000;

const arrowClassName =
  "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-brand-700 shadow-[0_10px_30px_-12px_rgb(11_31_51/0.45)] transition-[scale] duration-150 ease-out active:scale-95 md:grid";

interface BrandGalleryProps {
  imageUrls: string[];
  alt: string;
  ratio: number;
}

export function BrandGallery({ imageUrls, alt, ratio }: BrandGalleryProps) {
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
  } = useSlideCarousel(imageUrls.length);

  const count = imageUrls.length;
  const isPlaying = hasMany && !shouldReduceMotion && !isBusy;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = setTimeout(() => goBy(1), SLIDE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isPlaying, activeIndex, goBy]);

  return (
    <div className="grid gap-5">
      <div
        ref={viewportRef}
        aria-roledescription="carousel"
        aria-label={alt}
        style={{ aspectRatio: ratio }}
        className="relative overflow-hidden rounded-[28px] bg-surface"
      >
        <motion.div
          {...trackProps}
          className={cn(
            "absolute inset-0 touch-pan-y select-none",
            hasMany && "cursor-grab active:cursor-grabbing",
          )}
        >
          {imageUrls.map((url, index) => {
            const position = positionOf(index);

            return (
              <div
                key={index}
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
                <Image
                  src={url}
                  style={imageFrameStyle(url)}
                  alt={alt}
                  fill
                  unoptimized
                  draggable={false}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
            );
          })}
        </motion.div>

        {hasMany && (
          <>
            <button
              type="button"
              aria-label={t("home.previous")}
              onClick={() => goBy(-1)}
              className={cn(arrowClassName, "left-4")}
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label={t("home.next")}
              onClick={() => goBy(1)}
              className={cn(arrowClassName, "right-4")}
            >
              <ArrowRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {hasMany && (
        <div
          role="group"
          aria-label={t("home.slideIndicators")}
          className="flex justify-center gap-2"
        >
          {imageUrls.map((url, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={index}
                type="button"
                aria-label={t("home.goToSlide", { number: index + 1 })}
                aria-current={isActive}
                onClick={() => goTo(index, index > activeIndex ? 1 : -1)}
                className={cn(
                  "h-2 rounded-full transition-[width,background-color] duration-400 ease-(--ease-out)",
                  isActive
                    ? "w-9 bg-brand"
                    : "w-2 bg-brand-200 hover:bg-brand-300",
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
