"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface GrowBarProps {
  percent: number;
  className?: string;
}

export function GrowBar({ percent, className }: GrowBarProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span className="block h-6">
      <motion.span
        initial={shouldReduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        style={{ width: `${percent}%` }}
        className={cn("block h-full origin-left", className)}
      />
    </span>
  );
}
