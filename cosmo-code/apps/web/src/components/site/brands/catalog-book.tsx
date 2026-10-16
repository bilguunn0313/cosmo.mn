"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TURN_MS = 700;
const pad = (n: number) => String(n).padStart(2, "0");

interface CatalogBookProps {
  pages: string[];
  viewerUrl: string | null;
  year: number;
  coverTitle: string;
  labels: { prev: string; next: string; fullscreen: string; catalog: string };
}

function useIsWide() {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

function Page({ src, index }: { src: string | undefined; index: number }) {
  if (!src) return <div className="absolute inset-0 bg-white" />;
  return (
    <Image
      src={src}
      alt={`${index + 1}`}
      fill
      unoptimized
      sizes="(min-width: 768px) 45vw, 90vw"
      className="bg-white object-contain p-[4%]"
    />
  );
}

/**
 * Open-book catalog. Two pages per spread on ≥768px, a single page on mobile.
 * Desktop page turns are animated with a 3D leaf.
 */
export function CatalogBook({
  pages,
  viewerUrl,
  year,
  coverTitle,
  labels,
}: CatalogBookProps) {
  const wide = useIsWide();
  const reduce = useReducedMotion();
  const step = wide ? 2 : 1;
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<"next" | "prev" | null>(null);
  const timers = useRef<number[]>([]);

  const maxIndex = wide
    ? Math.max(0, pages.length - 1 - ((pages.length - 1) % 2))
    : pages.length - 1;

  useEffect(() => {
    setIndex((i) => (wide ? i - (i % 2) : i));
  }, [wide]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const go = useCallback(
    (dir: 1 | -1) => {
      const to = index + dir * step;
      if (turn || to < 0 || to > maxIndex) return;
      if (reduce || !wide) {
        setIndex(to);
        return;
      }
      setTurn(dir > 0 ? "next" : "prev");
      timers.current = [
        window.setTimeout(() => setIndex(to), TURN_MS / 2),
        window.setTimeout(() => setTurn(null), TURN_MS),
      ];
    },
    [index, step, turn, maxIndex, reduce, wide],
  );

  const atStart = index === 0;
  const atEnd = index >= maxIndex;
  const label = wide
    ? `${pad(index + 1)}–${pad(Math.min(index + 2, pages.length))} / ${pad(pages.length)}`
    : `${pad(index + 1)} / ${pad(pages.length)}`;

  const arrowClass =
    "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center bg-brand text-white shadow-md transition-[background-color,opacity] duration-200 hover:bg-brand-600 disabled:pointer-events-none disabled:opacity-30 md:size-14";

  return (
    <div
      role="region"
      aria-roledescription="catalog"
      aria-label={labels.catalog}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      className="outline-none"
    >
      <div className="relative bg-surface px-4 py-6 sm:px-16 md:px-[clamp(80px,7vw,128px)] md:py-[clamp(24px,4vw,64px)]">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={atStart}
          aria-label={labels.prev}
          className={cn(arrowClass, "left-2 md:left-[clamp(12px,1.6vw,32px)]")}
        >
          <ChevronLeft className="size-6" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={atEnd}
          aria-label={labels.next}
          className={cn(arrowClass, "right-2 md:right-[clamp(12px,1.6vw,32px)]")}
        >
          <ChevronRight className="size-6" />
        </button>

        <div className="relative grid aspect-[3/4] grid-cols-1 shadow-lg perspective-[2400px] md:aspect-[3/2] md:grid-cols-2">
          <div className="relative overflow-hidden bg-white">
            <Page src={pages[index]} index={index} />
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[14%] bg-linear-to-l from-brand-night/10 to-transparent md:block" />
          </div>
          {wide && (
            <div className="relative overflow-hidden bg-white">
              <Page src={pages[index + 1]} index={index + 1} />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[14%] bg-linear-to-r from-brand-night/10 to-transparent" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 -ml-px hidden w-0.5 bg-rule md:block" />

          {/* Closed cover that opens as the book scrolls into view (desktop only). */}
          <div
            aria-hidden
            className="book-cover-open pointer-events-none absolute inset-y-0 left-1/2 z-[1] hidden w-1/2 origin-left transform-3d md:block"
          >
            <div className="absolute inset-0 flex flex-col justify-between bg-brand p-[8%] text-white backface-hidden">
              <span className="text-[clamp(22px,2.4vw,40px)] font-bold tracking-[-0.04em]">
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

          {turn && (
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 left-1/2 w-1/2 origin-left transform-3d",
                turn === "next" ? "leaf-next" : "leaf-prev",
              )}
            >
              <div className="absolute inset-0 bg-white shadow-[-8px_0_24px_rgba(15,29,54,0.12)] backface-hidden" />
              <div className="absolute inset-0 rotate-y-180 bg-[#fbfbfc] backface-hidden" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-rule py-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold whitespace-nowrap tabular-nums">
            {label}
          </span>
          <span className="eyebrow whitespace-nowrap text-brand-700">
            {labels.catalog} {year}
          </span>
        </div>
        {viewerUrl && (
          <a
            href={viewerUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex h-12 items-center gap-2 px-4 text-[15px] font-medium whitespace-nowrap text-ink transition-colors hover:bg-brand-100 hover:text-brand-700"
          >
            {labels.fullscreen}
            <ArrowUpRight className="size-4" />
          </a>
        )}
      </div>
    </div>
  );
}
