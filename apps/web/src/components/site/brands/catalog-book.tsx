"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const TURN_MS = 700;
const WIDE_QUERY = "(min-width: 768px)";

function subscribeToWidth(onChange: () => void) {
  const query = window.matchMedia(WIDE_QUERY);
  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
}

function useIsWide() {
  return useSyncExternalStore(
    subscribeToWidth,
    () => window.matchMedia(WIDE_QUERY).matches,
    () => true,
  );
}

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

interface CatalogPageProps {
  src: string | undefined;
  pageNumber: number;
}

function CatalogPage({ src, pageNumber }: CatalogPageProps) {
  if (!src) {
    return <div className="absolute inset-0 bg-white" />;
  }

  return (
    <Image
      src={src}
      alt={String(pageNumber)}
      fill
      unoptimized
      sizes="(min-width: 768px) 45vw, 90vw"
      className="bg-white object-contain p-[4%]"
    />
  );
}

interface CatalogLabels {
  catalog: string;
  previous: string;
  next: string;
  fullscreen: string;
}

interface CatalogBookProps {
  pages: string[];
  viewerUrl: string | null;
  year: number;
  coverTitle: string;
  labels: CatalogLabels;
}

export function CatalogBook({
  pages,
  viewerUrl,
  year,
  coverTitle,
  labels,
}: CatalogBookProps) {
  const isWide = useIsWide();
  const shouldReduceMotion = useReducedMotion();
  const [pageIndex, setPageIndex] = useState(0);
  const [turnDirection, setTurnDirection] = useState<"next" | "prev" | null>(
    null,
  );
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const timers = timersRef.current;

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const step = isWide ? 2 : 1;
  const firstPage = isWide ? pageIndex - (pageIndex % 2) : pageIndex;
  const lastStart = isWide
    ? pages.length - 1 - ((pages.length - 1) % 2)
    : pages.length - 1;
  const isAtStart = firstPage === 0;
  const isAtEnd = firstPage >= lastStart;

  const pageLabel = isWide
    ? `${twoDigits(firstPage + 1)}-${twoDigits(Math.min(firstPage + 2, pages.length))} / ${twoDigits(pages.length)}`
    : `${twoDigits(firstPage + 1)} / ${twoDigits(pages.length)}`;

  const turn = (direction: 1 | -1) => {
    const target = firstPage + direction * step;

    if (turnDirection || target < 0 || target > lastStart) {
      return;
    }

    if (shouldReduceMotion || !isWide) {
      setPageIndex(target);
      return;
    }

    setTurnDirection(direction > 0 ? "next" : "prev");
    timersRef.current.push(
      window.setTimeout(() => setPageIndex(target), TURN_MS / 2),
      window.setTimeout(() => setTurnDirection(null), TURN_MS),
    );
  };

  const arrowClass =
    "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center bg-brand text-white shadow-md transition-[background-color,opacity] duration-200 hover:bg-brand-600 disabled:pointer-events-none disabled:opacity-30 md:size-14";

  return (
    <div
      role="region"
      aria-roledescription="catalog"
      aria-label={labels.catalog}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          turn(1);
        }

        if (event.key === "ArrowLeft") {
          turn(-1);
        }
      }}
      className="outline-offset-4 outline-brand focus-visible:outline-2"
    >
      <div className="relative bg-surface px-4 py-6 sm:px-16 md:px-[clamp(80px,7vw,128px)] md:py-[clamp(24px,4vw,64px)]">
        <button
          type="button"
          onClick={() => turn(-1)}
          disabled={isAtStart}
          aria-label={labels.previous}
          className={cn(arrowClass, "left-2 md:left-[clamp(12px,1.6vw,32px)]")}
        >
          <ChevronLeft className="size-6" />
        </button>
        <button
          type="button"
          onClick={() => turn(1)}
          disabled={isAtEnd}
          aria-label={labels.next}
          className={cn(
            arrowClass,
            "right-2 md:right-[clamp(12px,1.6vw,32px)]",
          )}
        >
          <ChevronRight className="size-6" />
        </button>

        <div className="relative mx-auto grid aspect-3/4 max-w-[calc((100svh-12rem)*0.75)] grid-cols-1 shadow-lg perspective-[2400px] md:aspect-3/2 md:max-w-[calc((100svh-12rem)*1.5)] md:grid-cols-2">
          <div className="relative overflow-hidden bg-white">
            <CatalogPage src={pages[firstPage]} pageNumber={firstPage + 1} />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-[14%] bg-linear-to-l from-brand-night/10 to-transparent md:block"
            />
          </div>
          {isWide && (
            <div className="relative overflow-hidden bg-white">
              <CatalogPage
                src={pages[firstPage + 1]}
                pageNumber={firstPage + 2}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-[14%] bg-linear-to-r from-brand-night/10 to-transparent"
              />
            </div>
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-rule md:block"
          />

          <div
            aria-hidden
            className="book-cover pointer-events-none absolute inset-y-0 left-1/2 z-1 w-1/2 origin-left transform-3d max-md:hidden"
          >
            <div className="absolute inset-0 flex flex-col justify-between bg-brand p-[8%] text-white backface-hidden">
              <span className="text-[clamp(22px,2.4vw,40px)] font-display font-bold tracking-[-0.03em]">
                Cosmo
              </span>
              <span className="grid gap-2">
                <span className="eyebrow">
                  {labels.catalog} {year}
                </span>
                <span className="text-[clamp(26px,3.2vw,56px)] leading-[0.95] font-semibold tracking-heading">
                  {coverTitle}
                </span>
              </span>
            </div>
          </div>

          {turnDirection && (
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 left-1/2 w-1/2 origin-left transform-3d",
                turnDirection === "next" ? "page-turn-next" : "page-turn-prev",
              )}
            >
              <div className="absolute inset-0 bg-white shadow-[-8px_0_24px_rgba(15,29,54,0.12)] backface-hidden" />
              <div className="absolute inset-0 rotate-y-180 bg-paper backface-hidden" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold whitespace-nowrap tabular-nums">
            {pageLabel}
          </span>
          <span className="eyebrow whitespace-nowrap text-brand-700">
            {labels.catalog} {year}
          </span>
        </div>
        {viewerUrl && (
          <a
            href={viewerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 px-4 text-sm font-semibold whitespace-nowrap text-ink transition-colors duration-150 hover:bg-brand-100 hover:text-brand-700"
          >
            {labels.fullscreen}
            <ArrowUpRight className="size-4" />
          </a>
        )}
      </div>
    </div>
  );
}
