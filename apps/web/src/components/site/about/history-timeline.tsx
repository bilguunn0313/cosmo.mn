"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import type { PublicMilestone } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

interface TimelineItem {
  key: string;
  title: string;
  lines: string[];
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
      continue;
    }

    items.push({
      key: String(milestone.id),
      title: milestone.title,
      lines,
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

interface HistoryTimelineProps {
  title: string;
  milestones: PublicMilestone[];
}

export function HistoryTimeline({ title, milestones }: HistoryTimelineProps) {
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 75%", "end 60%"],
  });
  const railProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const items = groupMilestones(milestones);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id="history"
      aria-labelledby="history-title"
      className="site-container scroll-mt-24 overflow-x-clip pt-20 md:pt-32"
    >
      <h2 id="history-title" className="type-h2">
        {title}
      </h2>

      <div ref={trackRef} className="relative mx-auto mt-8 max-w-300 md:mt-10">
        <div
          aria-hidden
          className="absolute inset-y-0 left-3.5 w-0.5 -translate-x-1/2 bg-rule md:left-1/2"
        />
        <motion.div
          aria-hidden
          style={{ scaleY: shouldReduceMotion ? 1 : railProgress }}
          className="absolute inset-y-0 left-3.5 w-0.5 origin-top -translate-x-1/2 bg-brand md:left-1/2"
        />

        <ol>
          {items.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <li
                key={item.key}
                className="grid grid-cols-[28px_minmax(0,1fr)] items-start py-3 md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] md:py-5"
              >
                <div className="col-start-1 row-start-1 flex justify-center pt-3 md:col-start-2 md:pt-3.5">
                  <motion.span
                    initial={shouldReduceMotion ? false : { scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    className="size-3.5 bg-brand shadow-[0_0_0_6px_var(--color-paper)]"
                  />
                </div>

                <motion.div
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: isLeft ? -96 : 96 }
                  }
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: shouldReduceMotion ? 0.2 : 0.8,
                    ease: EASE_OUT,
                  }}
                  className={cn(
                    "col-start-2 row-start-1 flex flex-col gap-2.5 pl-4",
                    isLeft
                      ? "md:col-start-1 md:items-end md:pr-12 md:pl-0 md:text-right"
                      : "md:col-start-3 md:pl-12",
                  )}
                >
                  <span className="type-stat text-brand">
                    {yearLabel(item)}
                  </span>
                  <h3 className="max-w-110 text-lg leading-[1.3] font-semibold tracking-[-0.015em] text-balance">
                    {item.title}
                  </h3>
                  {item.lines.map((line) => (
                    <p
                      key={line}
                      className="max-w-105 text-sm leading-normal text-ink-2"
                    >
                      {line}
                    </p>
                  ))}
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
