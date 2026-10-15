"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PublicMilestone } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const ACTIVE_TOLERANCE_PX = 8;

function yearColorClass(index: number, activeIndex: number) {
  if (index === activeIndex) {
    return "text-white";
  }

  return index < activeIndex ? "text-brand-300" : "text-white/35";
}

interface ArrowButtonProps {
  label: string;
  isDisabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ArrowButton({ label, isDisabled, onClick, children }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={isDisabled}
      onClick={onClick}
      className="flex size-13 items-center justify-center border-2 border-white/60 transition-[background-color,opacity] duration-150 hover:bg-brand-600 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

interface HistoryStripProps {
  milestones: PublicMilestone[];
}

export function HistoryStrip({ milestones }: HistoryStripProps) {
  const t = useTranslations();
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setCanScroll(track.scrollWidth > track.clientWidth + 1);
    });
    observer.observe(track);

    return () => observer.disconnect();
  }, []);

  const lastIndex = milestones.length - 1;
  const shownIndex = canScroll ? activeIndex : lastIndex;
  const shownProgress = canScroll ? progress : 1;
  const firstYear = milestones[0].year;
  const lastYear = milestones[lastIndex].year;

  const getCards = () =>
    Array.from(trackRef.current?.children ?? []) as HTMLElement[];

  const getGutter = (track: HTMLElement) =>
    parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;

  const handleScroll = () => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const maxScroll = track.scrollWidth - track.clientWidth;
    const isScrolledToEnd = track.scrollLeft >= maxScroll - 1;
    const gutter = getGutter(track);

    let nextActiveIndex = 0;
    getCards().forEach((card, index) => {
      if (card.offsetLeft - gutter <= track.scrollLeft + ACTIVE_TOLERANCE_PX) {
        nextActiveIndex = index;
      }
    });

    setProgress(maxScroll > 0 ? track.scrollLeft / maxScroll : 1);
    setActiveIndex(isScrolledToEnd ? lastIndex : nextActiveIndex);
  };

  const scrollToCard = (index: number) => {
    const track = trackRef.current;
    const card = getCards()[index];

    if (!track || !card) {
      return;
    }

    track.scrollTo({
      left: card.offsetLeft - getGutter(track),
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      aria-labelledby="history-title"
      className="bg-brand-night py-16 text-white md:py-22"
    >
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="grid gap-3">
            <h2
              id="history-title"
              className="text-[clamp(36px,4.4vw,64px)] leading-[0.95] font-semibold tracking-[-0.045em]"
            >
              {t("about.historyTitle")}
            </h2>
            <p className="text-[13px] font-semibold text-night-text tabular-nums">
              {firstYear}–{lastYear}
            </p>
          </div>
          {canScroll && (
            <div className="flex gap-0.5">
              <ArrowButton
                label={t("home.previous")}
                isDisabled={activeIndex === 0}
                onClick={() => scrollToCard(activeIndex - 1)}
              >
                <ChevronLeft className="size-5" />
              </ArrowButton>
              <ArrowButton
                label={t("home.next")}
                isDisabled={activeIndex === lastIndex}
                onClick={() => scrollToCard(activeIndex + 1)}
              >
                <ChevronRight className="size-5" />
              </ArrowButton>
            </div>
          )}
        </div>

        <div className="relative mt-6 h-0.5 bg-white/28">
          <div
            className="absolute inset-y-0 left-0 bg-brand-400"
            style={{ width: `${shownProgress * 100}%` }}
          />
        </div>
        <div className="no-scrollbar mt-3 flex justify-between gap-4 overflow-x-auto">
          {milestones.map((milestone, index) => (
            <button
              key={milestone.id}
              type="button"
              onClick={() => scrollToCard(index)}
              aria-current={index === shownIndex}
              className={cn(
                "py-1 text-[13px] font-semibold tabular-nums transition-colors duration-300 hover:text-white",
                yearColorClass(index, shownIndex),
              )}
            >
              {milestone.year}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        tabIndex={0}
        aria-label={t("about.historyTitle")}
        className="bleed-gutter no-scrollbar relative mt-10 flex snap-x snap-mandatory items-end overflow-x-auto outline-offset-4 outline-brand-400 focus-visible:outline-2 md:mt-14"
      >
        {milestones.map((milestone, index) => (
          <article
            key={milestone.id}
            className={cn(
              "flex shrink-0 snap-start flex-col gap-4 border-l-2 border-white/28 pr-8 pl-6 md:pr-10",
              milestone.imageUrl
                ? "w-[min(85vw,620px)]"
                : "w-[min(85vw,420px)]",
            )}
          >
            {milestone.imageUrl && (
              <div className="relative mb-1 h-[min(24vh,260px)] overflow-hidden bg-white/10">
                <Image
                  src={milestone.imageUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="620px"
                  className="object-cover"
                />
              </div>
            )}
            <span
              className={cn(
                "text-[clamp(56px,6vw,104px)] leading-[0.85] font-semibold tracking-[-0.055em] tabular-nums transition-colors duration-300",
                yearColorClass(index, shownIndex),
              )}
            >
              {milestone.year}
            </span>
            <h3 className="max-w-110 text-[26px] leading-[1.15] font-semibold tracking-[-0.02em]">
              {milestone.title}
            </h3>
            {milestone.description && (
              <p className="grid max-w-105 grid-cols-[20px_minmax(0,1fr)] text-base text-pretty text-night-text">
                <span aria-hidden className="text-brand-300">
                  —
                </span>
                <span>{milestone.description}</span>
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
