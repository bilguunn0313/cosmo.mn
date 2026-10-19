"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";

const COUNT_DURATION_SECONDS = 1.2;

function formatCount(
  count: number,
  locale: string,
  suffix: string,
  fractionDigits: number,
) {
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(count);

  return `${formatted}${suffix}`;
}

interface StatNumberProps {
  value: number;
  suffix?: string;
  fractionDigits?: number;
}

export function StatNumber({
  value,
  suffix = "",
  fractionDigits = 0,
}: StatNumberProps) {
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
      element.textContent = formatCount(0, locale, suffix, fractionDigits);
      return;
    }

    const controls = animate(0, value, {
      duration: COUNT_DURATION_SECONDS,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (count) => {
        element.textContent = formatCount(
          count,
          locale,
          suffix,
          fractionDigits,
        );
      },
    });

    return () => controls.stop();
  }, [isInView, shouldReduceMotion, value, locale, suffix, fractionDigits]);

  return (
    <span ref={ref}>{formatCount(value, locale, suffix, fractionDigits)}</span>
  );
}
