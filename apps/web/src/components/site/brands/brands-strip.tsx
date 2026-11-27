"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";
import { FadeInImage } from "@/components/site/fade-in-image";
import { Link } from "@/i18n/navigation";
import { brandPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";

const COPIES = 3;
const SWIPE_DISTANCE = 50;
const DRAG_START_DISTANCE = 4;
const SLIDE_DURATION_MS = 5000;

export interface BrandSlide {
  slug: string;
  name: string;
  productType: string | null;
  imageUrl: string;
  ratio: number;
}

interface DragState {
  startX: number;
  offset: number;
}

interface BrandsStripProps {
  slides: BrandSlide[];
}

export function BrandsStrip({ slides }: BrandsStripProps) {
  const t = useTranslations();
  const count = slides.length;
  const hasMany = count > 1;
  const firstPosition = hasMany ? count : 0;

  const viewRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasDraggedRef = useRef(false);
  const [position, setPosition] = useState(firstPosition);
  const [translate, setTranslate] = useState<number | null>(null);
  const [isSnapping, setIsSnapping] = useState(true);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);

  const isReady = translate !== null && isFirstImageLoaded;
  const showFirstImage = () => setIsFirstImageLoaded(true);
  const index = position % count;
  const items = Array.from(
    { length: hasMany ? count * COPIES : count },
    (_, itemIndex) => ({ slide: slides[itemIndex % count], itemIndex }),
  );
  const isDragging =
    drag !== null && Math.abs(drag.offset) > DRAG_START_DISTANCE;

  useLayoutEffect(() => {
    const view = viewRef.current;

    if (!view) {
      return;
    }

    const center = () => {
      const active = slideRefs.current[position];

      if (active) {
        setTranslate(
          view.clientWidth / 2 - (active.offsetLeft + active.offsetWidth / 2),
        );
      }
    };

    center();
    const observer = new ResizeObserver(center);
    observer.observe(view);

    return () => observer.disconnect();
  }, [position]);

  useLayoutEffect(() => {
    if (!isSnapping) {
      return;
    }

    const frame = requestAnimationFrame(() => setIsSnapping(false));
    return () => cancelAnimationFrame(frame);
  }, [isSnapping]);

  const step = (delta: number) => setPosition(position + delta);
  const goToIndex = (target: number) => setPosition(position - index + target);

  const recenterCopy = () => {
    if (hasMany && (position < count || position >= count * 2)) {
      setIsSnapping(true);
      setPosition(index + count);
    }
  };

  const endDrag = () => {
    if (drag && Math.abs(drag.offset) > SWIPE_DISTANCE) {
      step(drag.offset < 0 ? 1 : -1);
    }

    setDrag(null);
  };

  const dragProps = hasMany
    ? {
        onPointerDown: (event: React.PointerEvent) => {
          if (event.button === 0) {
            hasDraggedRef.current = false;
            setDrag({ startX: event.clientX, offset: 0 });
          }
        },
        onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
          if (!drag) {
            return;
          }

          const offset = event.clientX - drag.startX;

          if (
            !hasDraggedRef.current &&
            Math.abs(offset) > DRAG_START_DISTANCE
          ) {
            hasDraggedRef.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }

          setDrag({ ...drag, offset });
        },
        onPointerUp: endDrag,
        onPointerCancel: endDrag,
      }
    : {};

  return (
    <div className="mt-8 md:mt-14">
      <div
        ref={viewRef}
        aria-roledescription="carousel"
        aria-label={t("nav.brands")}
        className={cn(
          "relative h-52.5 touch-pan-y overflow-hidden select-none sm:h-80 md:h-105 lg:h-140",
          hasMany && "cursor-grab active:cursor-grabbing",
        )}
        {...dragProps}
      >
        <div
          style={{ translate: `${(translate ?? 0) + (drag?.offset ?? 0)}px 0` }}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget) {
              recenterCopy();
            }
          }}
          className={cn(
            "flex h-full gap-3 md:gap-6",
            isReady ? "brands-strip-enter" : "opacity-0",
            !isSnapping &&
              !isDragging &&
              "transition-[translate] duration-900 ease-(--ease-drawer) motion-reduce:transition-none",
          )}
        >
          {items.map(({ slide, itemIndex }) => {
            const isActive = itemIndex === position;

            return (
              <div
                key={itemIndex}
                ref={(element) => {
                  slideRefs.current[itemIndex] = element;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={t("home.slideLabel", {
                  current: (itemIndex % count) + 1,
                  total: count,
                })}
                aria-hidden={!isActive}
                style={{ aspectRatio: slide.ratio }}
                onClick={() => {
                  if (!isActive && !hasDraggedRef.current) {
                    setPosition(itemIndex);
                  }
                }}
                className={cn(
                  "relative h-full shrink-0 origin-[50%_85%] overflow-hidden rounded-card bg-surface",
                  !isSnapping &&
                    "transition-[opacity,scale] duration-700 ease-(--ease-drawer) motion-reduce:transition-none",
                  isActive
                    ? "opacity-100"
                    : "scale-90 cursor-pointer opacity-40",
                )}
              >
                <FadeInImage
                  src={slide.imageUrl}
                  alt=""
                  fill
                  unoptimized
                  draggable={false}
                  priority={itemIndex === firstPosition}
                  onLoad={
                    itemIndex === firstPosition ? showFirstImage : undefined
                  }
                  onError={
                    itemIndex === firstPosition ? showFirstImage : undefined
                  }
                  sizes="(min-width: 1024px) 70vw, 90vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 flex flex-col justify-end gap-0.5 bg-linear-to-t from-brand-night/65 via-brand-night/28 via-20% to-transparent to-45% px-5 pb-4 text-white [text-shadow:0_1px_12px_rgb(11_31_51/0.35)] md:via-16% md:to-32% md:px-7 md:pb-6",
                    !isSnapping &&
                      "transition-opacity duration-500 ease-out motion-reduce:transition-none",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                >
                  <span className="type-h4 leading-tight font-semibold md:type-h3">
                    {slide.name}
                  </span>
                  {slide.productType && (
                    <span className="text-sm leading-snug text-white/90 md:text-[15px]">
                      {slide.productType}
                    </span>
                  )}
                </div>
                {isActive && (
                  <Link
                    href={brandPath(slide.slug)}
                    draggable={false}
                    className="absolute inset-0 rounded-card outline-offset-4 outline-brand focus-visible:outline-2"
                  >
                    <span className="sr-only">{slide.name}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {hasMany && (
          <>
            <button
              type="button"
              aria-label={t("home.previous")}
              onClick={() => step(-1)}
              className="absolute top-1/2 left-6 z-10 hidden size-13 -translate-y-1/2 place-items-center rounded-full bg-white text-brand-700 shadow-[0_10px_30px_-12px_rgb(11_31_51/0.45)] transition-[scale] duration-150 ease-out active:scale-95 md:grid lg:left-10"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label={t("home.next")}
              onClick={() => step(1)}
              className="absolute top-1/2 right-6 z-10 hidden size-13 -translate-y-1/2 place-items-center rounded-full bg-white text-brand-700 shadow-[0_10px_30px_-12px_rgb(11_31_51/0.45)] transition-[scale] duration-150 ease-out active:scale-95 md:grid lg:right-10"
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
          className="mt-5 flex justify-center gap-2 md:mt-7"
        >
          {slides.map((slide, slideIndex) => {
            const isActive = slideIndex === index;

            return (
              <button
                key={slide.slug}
                type="button"
                aria-label={slide.name}
                aria-current={isActive}
                onClick={() => goToIndex(slideIndex)}
                className={cn(
                  "relative h-2 overflow-hidden rounded-full bg-brand-200 transition-[width,background-color] duration-400 ease-(--ease-out) hover:bg-brand-300",
                  isActive ? "w-9" : "w-2",
                )}
              >
                {isActive && isReady && drag === null && (
                  <span
                    key={position}
                    aria-hidden
                    style={{ animationDuration: `${SLIDE_DURATION_MS}ms` }}
                    onAnimationEnd={() => step(1)}
                    className="brands-strip-progress absolute inset-0 bg-brand"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
