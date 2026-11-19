"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { FadeInImage } from "@/components/site/fade-in-image";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import type { PublicMilestone } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const REACH_SHARE = 0.62;
const PHONE_REACH_SHARE = 0.95;
const PHONE_WIDTH = 640;
const FRAME_PADDING = 32;
const JUMP_OFFSET = 8;
const ACTIVE_OFFSET = 120;
const HINT_PROGRESS = 0.02;
const END_PROGRESS = 0.99;
const LONG_YEAR_LABEL = 9;

type Mode = "pin" | "swipe";

interface TimelineItem {
  key: string;
  title: string;
  lines: string[];
  imageUrl: string | null;
  years: number[];
}

interface Layout {
  mode: Mode;
  stickyTop: number;
  distance: number;
  stops: number[];
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
    const sameItem = items.find((item) =>
      isSameContent(item, milestone.title, lines),
    );

    if (sameItem) {
      sameItem.years.push(milestone.year);
      sameItem.imageUrl ??= milestone.imageUrl;
      continue;
    }

    items.push({
      key: String(milestone.id),
      title: milestone.title,
      lines,
      imageUrl: milestone.imageUrl,
      years: [milestone.year],
    });
  }

  return items;
}

function yearRanges(years: number[]) {
  const ranges: number[][] = [];

  for (const year of years) {
    const range = ranges.at(-1);

    if (range && range.at(-1) === year - 1) {
      range.push(year);
    } else {
      ranges.push([year]);
    }
  }

  return ranges;
}

function rangeLabel(first: number, last: number) {
  if (first === last) {
    return String(first);
  }

  return `${first}–${String(last).slice(2)}`;
}

function yearLabel(item: TimelineItem) {
  return yearRanges(item.years)
    .map((range) => rangeLabel(range[0], range[range.length - 1]))
    .join(" · ");
}

function shortYearLabel(item: TimelineItem) {
  return rangeLabel(item.years[0], item.years[item.years.length - 1]);
}

function yearChips(items: TimelineItem[]) {
  const chips: { label: string; index: number }[] = [];

  items.forEach((item, index) => {
    const label = shortYearLabel(item);

    if (!chips.some((chip) => chip.label === label)) {
      chips.push({ label, index });
    }
  });

  return chips;
}

function isBullet(line: string) {
  return line.startsWith("-");
}

function bulletText(line: string) {
  return line.replace(/^-\s*/, "");
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function leftWithin(element: Element, container: Element) {
  return (
    element.getBoundingClientRect().left -
    container.getBoundingClientRect().left
  );
}

function centerWithin(element: Element, container: Element) {
  return (
    leftWithin(element, container) + element.getBoundingClientRect().width / 2
  );
}

function lineDelay(index: number) {
  return { "--history-line": index } as React.CSSProperties;
}

function highlight(chunks: React.ReactNode) {
  return <span className="text-brand">{chunks}</span>;
}

interface TimelineEntryProps {
  item: TimelineItem;
  index: number;
  isReached: boolean;
  isRevealed: boolean;
}

function TimelineEntry({
  item,
  index,
  isReached,
  isRevealed,
}: TimelineEntryProps) {
  const isAbove = index % 2 === 0;
  const paragraphs = item.lines.filter((line) => !isBullet(line));
  const bullets = item.lines.filter(isBullet).map(bulletText);
  const label = yearLabel(item);

  return (
    <li
      data-stop
      data-reached={isReached || undefined}
      data-revealed={isRevealed || undefined}
      style={{ gridColumnStart: index + 1 }}
      className={cn(
        "history-item group row-span-3 row-start-1 grid grid-rows-subgrid",
        isAbove ? "[--history-from:24px]" : "[--history-from:-24px]",
      )}
    >
      <div
        className={cn(
          "history-card flex w-[calc(var(--step)*2-var(--card-gap))] flex-col gap-2.5",
          isAbove
            ? "row-start-1 self-end pb-1.5"
            : "row-start-3 self-start pt-1.5",
        )}
      >
        <p
          className={cn(
            "font-display leading-none font-semibold tracking-[-0.03em] text-brand tabular-nums",
            label.length > LONG_YEAR_LABEL
              ? "text-2xl md:text-[30px]"
              : "text-[30px] md:text-4xl",
            isAbove && "order-last",
          )}
        >
          {label}
        </p>

        <div className="flex items-center gap-3">
          {item.imageUrl && (
            <div className="relative h-12 w-18 shrink-0 overflow-hidden rounded-[10px] bg-white ring-1 ring-rule md:h-14 md:w-21">
              <FadeInImage
                src={item.imageUrl}
                alt=""
                fill
                unoptimized
                sizes="84px"
                className="object-contain p-1.5"
              />
            </div>
          )}
          <h3 className="font-display text-base leading-snug font-semibold text-balance text-ink md:text-lg">
            {item.title}
          </h3>
        </div>

        {paragraphs.map((line, lineIndex) => (
          <p
            key={line}
            style={lineDelay(lineIndex)}
            className="history-line text-sm leading-[1.6] text-pretty text-ink-2"
          >
            {line}
          </p>
        ))}

        {bullets.length > 0 && (
          <ul className="flex flex-col gap-1">
            {bullets.map((line, lineIndex) => (
              <li
                key={line}
                style={lineDelay(paragraphs.length + lineIndex)}
                className="history-line relative pl-4 text-sm leading-[1.55] text-pretty text-ink-2 before:absolute before:top-[0.75em] before:left-0 before:h-0.5 before:w-2 before:rounded-full before:bg-coral"
              >
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>

      <span
        data-dot
        aria-hidden
        className="relative z-10 row-start-2 size-4 self-center rounded-full border-2 border-brand-300 bg-white transition-colors duration-250 group-data-reached:border-brand"
      >
        <span className="absolute inset-0.5 scale-50 rounded-full bg-brand opacity-0 transition-[opacity,scale] duration-250 ease-(--ease-out) group-data-reached:scale-100 group-data-reached:opacity-100" />
        <span className="history-pulse absolute -inset-2 rounded-full border-2 border-brand opacity-0" />
      </span>
    </li>
  );
}

interface HistoryTimelineProps {
  eyebrow: string;
  milestones: PublicMilestone[];
}

export function HistoryTimeline({ eyebrow, milestones }: HistoryTimelineProps) {
  const t = useTranslations("about");
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<Layout | null>(null);
  const [mode, setMode] = useState<Mode>("pin");
  const [reachedCount, setReachedCount] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const items = groupMilestones(milestones);

  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    const heading = headingRef.current;
    const frame = frameRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    const bar = barRef.current;
    const progressRow = progressRef.current;

    if (
      !section ||
      !panel ||
      !heading ||
      !frame ||
      !track ||
      !fill ||
      !bar ||
      !progressRow
    ) {
      return;
    }

    document.documentElement.dataset.revealReady = "true";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let currentMode: Mode = "pin";
    let stickyTop = 0;
    let distance = 0;
    let startReach = 0;
    let firstCenter = 0;
    let endCenter = 0;
    let dotCenters: number[] = [];
    let stops: number[] = [];
    let animationFrame = 0;

    const showReach = (reach: number) => {
      const count = dotCenters.filter((center) => center <= reach + 1).length;

      fill.style.transform = `scaleX(${clamp((reach - firstCenter) / (endCenter - firstCenter))})`;
      setReachedCount(count);
      setRevealedCount((previous) => Math.max(previous, count));
    };

    const showPosition = (visibleLeft: number, progress: number) => {
      const mark = visibleLeft + ACTIVE_OFFSET;
      const passed = stops.filter((stop) => stop <= mark).length;

      bar.style.transform = `scaleX(${progress})`;
      setActiveIndex(
        progress >= END_PROGRESS ? stops.length - 1 : Math.max(0, passed - 1),
      );
      if (progress > HINT_PROGRESS) {
        setHasMoved(true);
      }
    };

    const update = () => {
      animationFrame = 0;

      if (currentMode === "swipe") {
        const scrollable = frame.scrollWidth - frame.clientWidth;
        const progress =
          scrollable > 0 ? clamp(frame.scrollLeft / scrollable) : 1;

        track.style.transform = "";
        showReach(endCenter);
        showPosition(frame.scrollLeft, progress);
        return;
      }

      const top = section.getBoundingClientRect().top;
      const travelled = stickyTop - top;
      const progress =
        distance > 0 ? clamp(travelled / distance) : travelled >= 0 ? 1 : 0;
      const entry = clamp(
        (window.innerHeight - top) / (window.innerHeight - stickyTop),
      );
      const reach =
        progress > 0
          ? startReach + progress * (endCenter - startReach)
          : entry * startReach;

      track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      showReach(reach);
      showPosition(progress * distance, progress);
    };

    const scheduleUpdate = () => {
      if (!animationFrame) {
        animationFrame = requestAnimationFrame(update);
      }
    };

    const measure = () => {
      const frameStyle = getComputedStyle(frame);
      const visibleWidth =
        frame.clientWidth -
        parseFloat(frameStyle.paddingLeft) -
        parseFloat(frameStyle.paddingRight);
      const needed =
        heading.offsetHeight +
        track.offsetHeight +
        progressRow.offsetHeight +
        FRAME_PADDING;
      const reachShare =
        visibleWidth < PHONE_WIDTH ? PHONE_REACH_SHARE : REACH_SHARE;

      stickyTop = parseFloat(getComputedStyle(panel).top) || 0;
      currentMode =
        reducedMotion.matches || needed > window.innerHeight - stickyTop
          ? "swipe"
          : "pin";
      distance = Math.max(0, track.offsetWidth - visibleWidth);
      startReach = visibleWidth * reachShare;
      dotCenters = [...track.querySelectorAll("[data-dot]")].map((dot) =>
        centerWithin(dot, track),
      );
      stops = [...track.querySelectorAll("[data-stop]")].map((stop) =>
        leftWithin(stop, track),
      );
      firstCenter = dotCenters[0] ?? 0;
      endCenter = dotCenters.at(-1) ?? 0;
      layoutRef.current = { mode: currentMode, stickyTop, distance, stops };

      section.style.setProperty("--distance", `${distance}px`);
      setMode(currentMode);
      scheduleUpdate();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    resizeObserver.observe(heading);

    measure();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    frame.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", measure);
    reducedMotion.addEventListener("change", measure);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      frame.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", measure);
      reducedMotion.removeEventListener("change", measure);
    };
  }, []);

  const jumpTo = (index: number) => {
    const layout = layoutRef.current;
    const section = sectionRef.current;
    const frame = frameRef.current;

    if (!layout || !section || !frame) {
      return;
    }

    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";
    const isLast = index >= layout.stops.length - 1;
    const target = Math.max(0, layout.stops[index] - JUMP_OFFSET);

    if (layout.mode === "swipe") {
      frame.scrollTo({ left: isLast ? frame.scrollWidth : target, behavior });
      return;
    }

    const progress =
      isLast || layout.distance === 0 ? 1 : clamp(target / layout.distance);
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: sectionTop - layout.stickyTop + progress * layout.distance,
      behavior,
    });
  };

  if (items.length === 0) {
    return null;
  }

  const isPinned = mode === "pin";
  const chips = yearChips(items);
  const activeLabel = items[activeIndex]
    ? shortYearLabel(items[activeIndex])
    : null;

  return (
    <section
      ref={sectionRef}
      id="history"
      aria-labelledby="history-title"
      className={cn(
        "relative scroll-mt-24 overflow-x-clip",
        isPinned &&
          "h-[calc(100svh-4rem+var(--distance,0px))] lg:h-[calc(100svh-5.25rem+var(--distance,0px))]",
      )}
    >
      <div
        ref={panelRef}
        className={cn(
          "top-16 flex flex-col lg:top-21",
          isPinned
            ? "sticky h-[calc(100svh-4rem)] overflow-hidden lg:h-[calc(100svh-5.25rem)]"
            : "relative",
        )}
      >
        <div ref={headingRef} className="site-container pt-8">
          <Reveal className="flex flex-col gap-4 md:items-center md:text-center">
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            <h2
              id="history-title"
              className="type-section text-balance text-ink"
            >
              {t.rich("historyHeading", { highlight })}
            </h2>
          </Reveal>
        </div>

        <div
          ref={frameRef}
          tabIndex={isPinned ? undefined : 0}
          aria-labelledby={isPinned ? undefined : "history-title"}
          className={cn(
            "site-container flex flex-1 items-center",
            isPinned
              ? "py-4"
              : "overflow-x-auto overscroll-x-contain pt-10 pb-6 focus-visible:outline-2 focus-visible:outline-brand",
          )}
        >
          <ol
            ref={trackRef}
            aria-labelledby="history-title"
            style={{ "--columns": items.length } as React.CSSProperties}
            className="relative grid w-max shrink-0 grid-rows-[auto_3rem_auto] [--card-gap:2.5rem] [--step:10rem] [grid-template-columns:repeat(var(--columns),var(--step))_calc(var(--step)-var(--card-gap))] md:[--card-gap:3.5rem] md:[--step:12.5rem]"
          >
            <li
              aria-hidden
              className="relative col-span-full row-start-2 mr-[calc(var(--step)*2-var(--card-gap)-0.5rem)] ml-2 h-0.5 self-center overflow-hidden rounded-full bg-brand-200"
            >
              <span
                ref={fillRef}
                className="absolute inset-0 origin-left bg-brand [transform:scaleX(0)]"
              />
            </li>

            {items.map((item, index) => (
              <TimelineEntry
                key={item.key}
                item={item}
                index={index}
                isReached={index < reachedCount}
                isRevealed={index < revealedCount}
              />
            ))}
          </ol>
        </div>

        <div
          ref={progressRef}
          className="site-container flex flex-wrap items-center gap-x-5 gap-y-2.5 pb-5 md:flex-nowrap md:pb-6"
        >
          <div
            role="group"
            aria-label={t("historyIndexLabel")}
            className="no-scrollbar -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 md:mx-0 md:w-auto md:shrink-0 md:px-0"
          >
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                aria-current={chip.label === activeLabel || undefined}
                onClick={() => jumpTo(chip.index)}
                className="shrink-0 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 font-display text-sm font-semibold text-ink-2 tabular-nums transition-[background-color,color,border-color,scale] duration-200 ease-out hover:border-brand-400 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.97] aria-[current=true]:border-brand aria-[current=true]:bg-brand aria-[current=true]:text-white"
              >
                {chip.label}
              </button>
            ))}
          </div>
          <span
            aria-hidden
            className="h-0.75 flex-1 basis-full overflow-hidden rounded-full bg-brand-100 md:basis-auto"
          >
            <span
              ref={barRef}
              className="block h-full origin-left bg-brand [transform:scaleX(0)]"
            />
          </span>
          <span
            aria-hidden
            className={cn(
              "text-[13px] text-ink-3 transition-opacity duration-300 max-md:hidden",
              hasMoved && "opacity-0",
            )}
          >
            {t("historyHint")} →
          </span>
        </div>
      </div>
    </section>
  );
}
