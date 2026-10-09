"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

const CLIP_HIDDEN = "inset(100% 0% 0% 0%)";
const CLIP_SHOWN = "inset(0% 0% 0% 0%)";

interface ImageRevealProps {
  delay?: number;
  children: React.ReactNode;
}

export function ImageReveal({ delay = 0, children }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.3, delay }}
          className="absolute inset-0"
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={ref} className="absolute inset-0">
      <motion.div
        initial={{ clipPath: CLIP_HIDDEN }}
        animate={{ clipPath: isInView ? CLIP_SHOWN : CLIP_HIDDEN }}
        transition={{ duration: 1, delay, ease: [0.77, 0, 0.175, 1] }}
        className="absolute inset-0"
      >
        <motion.div
          initial={{ transform: "scale(1.15)" }}
          animate={{ transform: isInView ? "scale(1)" : "scale(1.15)" }}
          transition={{ duration: 1.4, delay, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
