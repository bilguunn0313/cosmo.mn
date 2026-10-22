"use client";

import { animate } from "motion/react";
import type { AnimationPlaybackControls } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import type { PublicBrand } from "@/lib/public-api";
import { brandPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";

const MIN_ITEMS_PER_LOOP = 8;
const SECONDS_PER_ITEM = 4;
const HOVER_SPEED = 0.25;
const SPEED_CHANGE_SECONDS = 0.4;

function fillLoop(brands: PublicBrand[]) {
  const items = [...brands];

  while (items.length < MIN_ITEMS_PER_LOOP) {
    items.push(...brands);
  }

  return items;
}

interface BrandLogoProps {
  brand: PublicBrand;
  isRepeat: boolean;
}

function BrandLogo({ brand, isRepeat }: BrandLogoProps) {
  return (
    <Link
      href={brandPath(brand.slug)}
      tabIndex={isRepeat ? -1 : undefined}
      aria-hidden={isRepeat || undefined}
      className={cn(
        "group flex h-16 w-40 shrink-0 items-center justify-center px-6 md:h-20 md:w-56 md:px-10",
        isRepeat && "motion-reduce:hidden",
      )}
    >
      {brand.logoUrl ? (
        <span className="relative size-full">
          <Image
            src={brand.logoUrl}
            alt={brand.name}
            fill
            unoptimized
            sizes="224px"
            className="object-contain mix-blend-multiply transition-[scale] duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
        </span>
      ) : (
        <span className="text-xl font-semibold tracking-heading">
          {brand.name}
        </span>
      )}
    </Link>
  );
}

interface MarqueeRowProps {
  brands: PublicBrand[];
  isReversed?: boolean;
}

export function MarqueeRow({ brands, isReversed = false }: MarqueeRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const speedChangeRef = useRef<AnimationPlaybackControls | null>(null);

  const items = fillLoop(brands);

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
          changeSpeed(HOVER_SPEED);
        }
      }}
      onPointerLeave={() => changeSpeed(1)}
      onFocus={() => changeSpeed(0)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          changeSpeed(1);
        }
      }}
      className="min-w-0 overflow-hidden"
    >
      <div
        ref={trackRef}
        style={{ animationDuration: `${items.length * SECONDS_PER_ITEM}s` }}
        className={cn(
          "flex w-max animate-marquee motion-reduce:w-full motion-reduce:animate-none",
          isReversed && "[animation-direction:reverse]",
        )}
      >
        <div className="flex shrink-0 motion-reduce:w-full motion-reduce:flex-wrap">
          {items.map((brand, index) => (
            <BrandLogo
              key={`${brand.slug}-${index}`}
              brand={brand}
              isRepeat={index >= brands.length}
            />
          ))}
        </div>
        <div aria-hidden className="flex shrink-0 motion-reduce:hidden">
          {items.map((brand, index) => (
            <BrandLogo
              key={`${brand.slug}-copy-${index}`}
              brand={brand}
              isRepeat
            />
          ))}
        </div>
      </div>
    </div>
  );
}
