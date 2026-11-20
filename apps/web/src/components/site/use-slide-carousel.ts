"use client";

import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import type { PanInfo } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD_PX = 50;
const SWIPE_VELOCITY_PX = 500;
const SLIDE_TRANSITION = { duration: 0.7, ease: [0.32, 0.72, 0, 1] } as const;

export type Direction = 1 | -1;

interface PendingSlide {
  index: number;
  direction: Direction;
}

function swipeStep({ offset, velocity }: PanInfo): Direction | 0 {
  const isFlick = Math.abs(velocity.x) > SWIPE_VELOCITY_PX;

  if (!isFlick && Math.abs(offset.x) <= SWIPE_THRESHOLD_PX) {
    return 0;
  }

  const direction = isFlick ? velocity.x : offset.x;

  return direction < 0 ? 1 : -1;
}

interface SlidePositionInput {
  index: number;
  activeIndex: number;
  pending: PendingSlide | null;
  count: number;
  revealSide: Direction;
}

function slidePosition({
  index,
  activeIndex,
  pending,
  count,
  revealSide,
}: SlidePositionInput) {
  if (index === activeIndex) {
    return 0;
  }

  if (pending) {
    return index === pending.index ? pending.direction : null;
  }

  if (count === 2) {
    return revealSide;
  }

  const stepsForward = (index - activeIndex + count) % count;

  if (stepsForward === 1) {
    return 1;
  }

  if (stepsForward === count - 1) {
    return -1;
  }

  return null;
}

export function useSlideCarousel(count: number) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const trackX = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pending, setPending] = useState<PendingSlide | null>(null);
  const [revealSide, setRevealSide] = useState<Direction>(1);
  const [isDragging, setIsDragging] = useState(false);
  const hasMany = count > 1;

  useMotionValueEvent(trackX, "change", (latest) => {
    const side = latest > 0 ? -1 : 1;

    if (side !== revealSide) {
      setRevealSide(side);
    }
  });

  useEffect(() => {
    if (!pending) {
      return;
    }

    let isCancelled = false;
    const width = viewportRef.current?.offsetWidth ?? 0;
    const controls = animate(
      trackX,
      -pending.direction * width,
      shouldReduceMotion ? { duration: 0 } : SLIDE_TRANSITION,
    );

    controls.then(() => {
      if (!isCancelled) {
        setActiveIndex(pending.index);
        setPending(null);
      }
    });

    return () => {
      isCancelled = true;
      controls.stop();
    };
  }, [pending, shouldReduceMotion, trackX]);

  useLayoutEffect(() => {
    trackX.set(0);
  }, [activeIndex, trackX]);

  const goTo = (index: number, direction: Direction) => {
    if (pending || index === activeIndex) {
      return;
    }

    setPending({ index, direction });
  };

  const goBy = (step: Direction) => {
    goTo((activeIndex + step + count) % count, step);
  };

  const handleDragEnd = (info: PanInfo) => {
    setIsDragging(false);
    const step = swipeStep(info);

    if (step === 0) {
      animate(trackX, 0, SLIDE_TRANSITION);
      return;
    }

    goBy(step);
  };

  const positionOf = (index: number) =>
    slidePosition({ index, activeIndex, pending, count, revealSide });

  return {
    viewportRef,
    activeIndex,
    hasMany,
    shouldReduceMotion,
    isBusy: isDragging || pending !== null,
    positionOf,
    goTo,
    goBy,
    trackProps: {
      style: { x: trackX },
      drag: hasMany && !pending ? ("x" as const) : false,
      dragMomentum: false,
      onDragStart: () => setIsDragging(true),
      onDragEnd: (_event: unknown, info: PanInfo) => handleDragEnd(info),
    },
  };
}
