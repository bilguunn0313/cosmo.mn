"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

export function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const transform = useTransform(
    scrollYProgress,
    (progress) => `scaleY(${progress})`,
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-y-0 left-[7px] w-0.5 lg:left-1/2 lg:-translate-x-1/2"
    >
      <div className="absolute inset-0 rounded-full bg-foreground/10" />
      <motion.div
        style={shouldReduceMotion ? undefined : { transform }}
        className="absolute inset-0 origin-top rounded-full bg-linear-to-b from-brand-deep to-brand"
      />
    </div>
  );
}
