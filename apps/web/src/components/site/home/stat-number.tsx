"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";

const COUNT_DURATION_SECONDS = 1.2;

function formatCount(count: number, locale: string, suffix: string) {
  return `${new Intl.NumberFormat(locale).format(count)}${suffix}`;
}

interface StatNumberProps {
  value: number;
  suffix?: string;
}

export function StatNumber({ value, suffix = "" }: StatNumberProps) {
  const locale = useLocale();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;

    if (!element || shouldReduceMotion) {
      return;
    }

    if (!isInView) {
      element.textContent = formatCount(0, locale, suffix);
      return;
    }

    const controls = animate(0, value, {
      duration: COUNT_DURATION_SECONDS,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (count) => {
        element.textContent = formatCount(Math.round(count), locale, suffix);
      },
    });

    return () => controls.stop();
  }, [isInView, shouldReduceMotion, value, locale, suffix]);

  return <span ref={ref}>{formatCount(value, locale, suffix)}</span>;
}
