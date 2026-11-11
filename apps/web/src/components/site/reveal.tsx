"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const STAGGER_MS = 90;
export const VISIBLE_THRESHOLD = 0.15;

interface RevealProps {
  from?: "up" | "left" | "right" | "zoom";
  index?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export function Reveal({
  from = "up",
  index = 0,
  delay = 0,
  className,
  children,
}: RevealProps) {
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
      { threshold: VISIBLE_THRESHOLD },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-from={from}
      style={
        {
          "--reveal-delay": `${delay * 1000 + index * STAGGER_MS}ms`,
        } as React.CSSProperties
      }
      className={cn("reveal", className)}
    >
      {children}
    </div>
  );
}
