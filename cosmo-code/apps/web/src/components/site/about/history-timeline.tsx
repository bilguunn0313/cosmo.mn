"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import type { Award } from "@/lib/about";
import type { PublicMilestone } from "@/lib/public-api";
import { cn } from "@/lib/utils";

interface TimelineItem {
  key: string;
  year: string;
  title: string;
  lines: string[];
}

/** Collapse consecutive years with identical content into one "2005-08" row. */
function groupMilestones(list: PublicMilestone[]): TimelineItem[] {
  const sorted = [...list].sort((a, b) => a.year - b.year);
  const out: (TimelineItem & { from: number; to: number })[] = [];
  for (const m of sorted) {
    const lines = (m.description ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const prev = out[out.length - 1];
    if (
      prev &&
      prev.to === m.year - 1 &&
      prev.title === m.title &&
      prev.lines.join("|") === lines.join("|")
    ) {
      prev.to = m.year;
      continue;
    }
    out.push({ key: String(m.id), year: "", title: m.title, lines, from: m.year, to: m.year });
  }
  return out.map((m) => ({
    key: m.key,
    title: m.title,
    lines: m.lines,
    year: m.from === m.to ? String(m.from) : `${m.from}-${String(m.to).slice(2)}`,
  }));
}

const EASE = [0.23, 1, 0.32, 1] as const;

interface HistoryTimelineProps {
  title: string;
  milestones: PublicMilestone[];
  awards: Award[];
}

export function HistoryTimeline({ title, milestones, awards }: HistoryTimelineProps) {
  const items = groupMilestones(milestones);
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 75%", "end 60%"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  if (items.length === 0) return null;
  const first = items[0].year.slice(0, 4);
  const last = milestones.reduce((max, m) => Math.max(max, m.year), 0);

  return (
    <section
      id="history"
      className="mx-auto max-w-[1200px] scroll-mt-24 px-4 pt-24 md:px-6 md:pt-32 xl:px-12 xl:pt-40"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4 pb-6 md:pb-10">
        <h2 className="m-0 text-[clamp(40px,4.8vw,72px)] leading-[0.95] font-bold tracking-[-0.045em]">
          {title}
        </h2>
        <span className="text-[17px] font-semibold whitespace-nowrap text-ink-3 tabular-nums">
          {first}-{last}
        </span>
      </div>

      {awards.length > 0 && (
        <div className="mb-14 grid grid-cols-1 gap-[2px] border-2 border-rule bg-rule sm:grid-cols-3 md:mb-24">
          {awards.map((a, i) => (
            <div
              key={a.label}
              className={cn(
                "flex items-baseline gap-4 p-5 md:p-8",
                i === 0 ? "bg-brand text-white" : "bg-background",
              )}
            >
              <span
                className={cn(
                  "text-[clamp(44px,4.4vw,64px)] leading-[0.9] font-bold tracking-[-0.05em]",
                  i !== 0 && "text-brand",
                )}
              >
                {a.count}
              </span>
              <span className="text-base leading-snug font-semibold">{a.label}</span>
            </div>
          ))}
        </div>
      )}

      <div ref={trackRef} className="relative">
        {/* Rail: left on mobile, centre from md */}
        <div aria-hidden className="absolute inset-y-0 left-[14px] w-[2px] -translate-x-1/2 bg-rule md:left-1/2" />
        <motion.div
          aria-hidden
          style={{ scaleY: reduce ? 1 : lineScale }}
          className="absolute inset-y-0 left-[14px] w-[2px] origin-top -translate-x-1/2 bg-brand md:left-1/2"
        />

        <ol className="m-0 list-none p-0">
          {items.map((m, i) => {
            const isLeft = i % 2 === 0;
            return (
              <li
                key={m.key}
                className="grid grid-cols-[28px_minmax(0,1fr)] items-start py-4 md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] md:py-8"
              >
                <div className="col-start-1 row-start-1 flex justify-center pt-3.5 md:col-start-2 md:pt-5">
                  <motion.span
                    initial={reduce ? false : { scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    className="size-3.5 bg-brand shadow-[0_0_0_6px_var(--color-background)]"
                  />
                </div>

                <motion.div
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: isLeft ? -96 : 96 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: reduce ? 0.2 : 0.8, ease: EASE }}
                  className={cn(
                    "col-start-2 row-start-1 flex flex-col gap-2.5 pl-4",
                    isLeft
                      ? "md:col-start-1 md:items-end md:pr-12 md:pl-0 md:text-right"
                      : "md:col-start-3 md:pl-12",
                  )}
                >
                  <span className="text-[clamp(40px,4.4vw,64px)] leading-[0.9] font-bold tracking-[-0.05em] text-brand tabular-nums">
                    {m.year}
                  </span>
                  <h3 className="m-0 max-w-[440px] text-[clamp(18px,1.6vw,22px)] leading-[1.3] font-semibold tracking-[-0.015em] text-balance">
                    {m.title}
                  </h3>
                  {m.lines.map((line) => (
                    <p key={line} className="m-0 max-w-[420px] text-[15px] leading-normal text-ink-2">
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
