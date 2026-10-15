"use client";

import { motion, useScroll } from "motion/react";

/** 4px accent bar under the sticky header that fills as the article is read. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-[var(--site-header-height,84px)] z-40 h-1 origin-left bg-brand"
    />
  );
}
