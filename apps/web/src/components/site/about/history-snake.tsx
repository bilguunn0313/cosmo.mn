"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const VISIBLE_SHARE = 0.2;

interface HistorySnakeProps {
  width: number;
  height: number;
  drawMs: number;
  className?: string;
  children: React.ReactNode;
}

export function HistorySnake({
  width,
  height,
  drawMs,
  className,
  children,
}: HistorySnakeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    document.documentElement.dataset.revealReady = "true";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.revealed = "true";
          observer.disconnect();
        }
      },
      { threshold: VISIBLE_SHARE },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={
        {
          aspectRatio: `${width} / ${height}`,
          "--draw-duration": `${drawMs}ms`,
        } as React.CSSProperties
      }
      className={cn("history-snake relative w-full", className)}
    >
      {children}
    </div>
  );
}
