"use client";

import { motion, useReducedMotion } from "motion/react";

const REVEAL_OFFSET_PX = 24;
const STAGGER_SECONDS = 0.06;

interface RevealProps {
  index?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export function Reveal({
  index = 0,
  delay = 0,
  className,
  children,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{
        opacity: 0,
        transform: `translateY(${shouldReduceMotion ? 0 : REVEAL_OFFSET_PX}px)`,
      }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.6,
        delay: delay + index * STAGGER_SECONDS,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
