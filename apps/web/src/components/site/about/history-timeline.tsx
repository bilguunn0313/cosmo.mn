"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { FadeInImage } from "@/components/site/fade-in-image";
import {
  Reveal,
  STAGGER_MS,
  VISIBLE_THRESHOLD,
} from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import type { PublicMilestone } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const SCROLL_SHARE = 0.7;
const EDGE_TOLERANCE = 4;
const MAX_STAGGER_INDEX = 3;

interface TimelineItem {
  key: string;
  title: string;
  lines: string[];
  imageUrl: string | null;
  firstYear: number;
  lastYear: number;
}

function descriptionLines(description: string | null) {
  return (description ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function isSameContent(item: TimelineItem, title: string, lines: string[]) {
  return item.title === title && item.lines.join("\n") === lines.join("\n");
}

function groupMilestones(milestones: PublicMilestone[]) {
  const sorted = [...milestones].sort((a, b) => a.year - b.year);
  const items: TimelineItem[] = [];

  for (const milestone of sorted) {
    const lines = descriptionLines(milestone.description);
    const previous = items.at(-1);
    const continuesPrevious =
      previous !== undefined &&
      previous.lastYear === milestone.year - 1 &&
      isSameContent(previous, milestone.title, lines);

    if (continuesPrevious) {
      previous.lastYear = milestone.year;
      previous.imageUrl ??= milestone.imageUrl;
      continue;
    }

    items.push({
      key: String(milestone.id),
      title: milestone.title,
      lines,
      imageUrl: milestone.imageUrl,
      firstYear: milestone.year,
      lastYear: milestone.year,
    });
  }

  return items;
}

function yearLabel(item: TimelineItem) {
  if (item.firstYear === item.lastYear) {
    return String(item.firstYear);
  }

  return `${item.firstYear}-${String(item.lastYear).slice(2)}`;
}

interface ScrollButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ScrollButton({ label, disabled, onClick, children }: ScrollButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-13 items-center justify-center rounded-full border border-brand-200 bg-white text-brand transition-[background-color,border-color,opacity,scale] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand enabled:hover:border-brand-300 enabled:hover:bg-brand-100 disabled:opacity-35 motion-safe:enabled:active:scale-[0.96]"
    >
      {children}
    </button>
  );
}

interface HistoryTimelineProps {
  eyebrow: string;
  title: string;
  milestones: PublicMilestone[];
}

export function HistoryTimeline({
  eyebrow,
  title,
  milestones,
}: HistoryTimelineProps) {
  const t = useTranslations("about");
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLOListElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isTrackRevealed, setIsTrackRevealed] = useState(false);
  const [isScrollable, setIsScrollable] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);

  const items = groupMilestones(milestones);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTrackRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: VISIBLE_THRESHOLD },
    );

    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const updateProgress = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const visibleShare = track.clientWidth / track.scrollWidth;
      const progress = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
      const offsetInThumbWidths = (progress * (1 - visibleShare)) / visibleShare;
      const thumb = thumbRef.current;

      if (thumb) {
        thumb.style.width = `${visibleShare * 100}%`;
        thumb.style.transform = `translateX(${offsetInThumbWidths * 100}%)`;
      }

      setIsScrollable(maxScroll > EDGE_TOLERANCE);
      setCanGoBack(track.scrollLeft > EDGE_TOLERANCE);
      setCanGoForward(track.scrollLeft < maxScroll - EDGE_TOLERANCE);
    };

    updateProgress();
    track.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      track.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  function scrollTrack(direction: 1 | -1) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    track.scrollBy({
      left: direction * track.clientWidth * SCROLL_SHARE,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id="history"
      aria-labelledby="history-title"
      className="scroll-mt-24 overflow-x-clip pt-20 md:pt-28"
    >
      <div className="site-container flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
        <Reveal className="flex flex-col gap-4.5">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 id="history-title" className="type-section text-balance text-ink">
            {title}
          </h2>
        </Reveal>

        <div className={cn("flex gap-3", !isScrollable && "invisible")}>
          <ScrollButton
            label={t("historyPrevious")}
            disabled={!canGoBack}
            onClick={() => scrollTrack(-1)}
          >
            <ArrowLeft className="size-5.5" />
          </ScrollButton>
          <ScrollButton
            label={t("historyNext")}
            disabled={!canGoForward}
            onClick={() => scrollTrack(1)}
          >
            <ArrowRight className="size-5.5" />
          </ScrollButton>
        </div>
      </div>

      <ol
        ref={trackRef}
        tabIndex={0}
        aria-labelledby="history-title"
        className="bleed-gutter no-scrollbar mt-10 -mb-6 flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden overscroll-x-contain pt-2 pb-9 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand md:mt-14 md:gap-8"
      >
        {items.map((item, index) => (
          <li key={item.key} className="group w-[78%] shrink-0 snap-start sm:w-70">
            <div
              data-from="up"
              data-revealed={isTrackRevealed || undefined}
              style={
                {
                  "--reveal-delay": `${Math.min(index, MAX_STAGGER_INDEX) * STAGGER_MS}ms`,
                } as React.CSSProperties
              }
              className="reveal flex flex-col"
            >
              <span className="type-stat text-brand">{yearLabel(item)}</span>
              <span aria-hidden className="relative mt-4.5 mb-6 block h-4">
                <span className="timeline-line absolute top-1.75 left-0 -right-6 h-0.5 bg-rule group-last:hidden md:-right-8" />
                <span
                  className={cn(
                    "timeline-dot relative block size-4 rounded-full border-[3px] border-brand bg-white",
                    index === items.length - 1 &&
                      "bg-brand shadow-[0_0_0_6px_var(--color-brand-200)]",
                  )}
                />
              </span>
              <h3 className="text-lg leading-[1.35] font-semibold tracking-[-0.015em] text-balance text-ink">
                {item.title}
              </h3>
              {item.lines.map((line) => (
                <p
                  key={line}
                  className="mt-2 text-[15px] leading-relaxed text-pretty text-ink-2"
                >
                  {line}
                </p>
              ))}
              {item.imageUrl && (
                <div className="relative mt-5.5 aspect-16/10 overflow-hidden rounded-card bg-surface sm:aspect-4/3">
                  <FadeInImage
                    src={item.imageUrl}
                    alt=""
                    fill
                    unoptimized
                    sizes="(min-width: 640px) 280px, 78vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div
        aria-hidden
        className={cn(
          "site-container mt-10 flex items-center gap-5 text-sm font-medium text-ink-3 tabular-nums",
          !isScrollable && "invisible",
        )}
      >
        <span>{items[0].firstYear}</span>
        <div className="relative h-0.5 flex-1 rounded-full bg-rule">
          <div
            ref={thumbRef}
            className="absolute -top-px left-0 h-1 w-1/4 rounded-full bg-brand"
          />
        </div>
        <span>{t("historyNow")}</span>
      </div>
    </section>
  );
}
