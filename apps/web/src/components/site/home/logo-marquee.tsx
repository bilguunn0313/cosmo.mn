"use client";

import { animate } from "motion/react";
import type { AnimationPlaybackControls } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const SPEED_CHANGE_SECONDS = 0.6;

interface LogoMarqueeProps {
  tileCount: number;
  secondsPerTile: number;
  className?: string;
  children: React.ReactNode;
}

export function LogoMarquee({
  tileCount,
  secondsPerTile,
  className,
  children,
}: LogoMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const speedChangeRef = useRef<AnimationPlaybackControls | null>(null);

  const changeSpeed = (target: number) => {
    const animation = trackRef.current?.getAnimations()[0];

    if (!animation) {
      return;
    }

    speedChangeRef.current?.stop();
    speedChangeRef.current = animate(animation.playbackRate, target, {
      duration: SPEED_CHANGE_SECONDS,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (rate) => animation.updatePlaybackRate(rate),
    });
  };

  return (
    <div
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          changeSpeed(0);
        }
      }}
      onPointerLeave={() => changeSpeed(1)}
      onFocus={() => changeSpeed(0)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          changeSpeed(1);
        }
      }}
      className={cn("@container overflow-hidden", className)}
    >
      <div
        ref={trackRef}
        style={{ animationDuration: `${tileCount * secondsPerTile}s` }}
        className="flex w-max animate-marquee motion-reduce:w-full motion-reduce:animate-none"
      >
        <div className="flex shrink-0 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
          {children}
        </div>
        <div aria-hidden inert className="flex shrink-0 motion-reduce:hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
