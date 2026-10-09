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
        "flex h-14 w-32 shrink-0 items-center justify-center opacity-55 grayscale transition-[opacity,filter] duration-200 ease-(--ease-out) hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0",
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
            sizes="128px"
            className="object-contain"
          />
        </span>
      ) : (
        <span className="text-xl font-semibold tracking-tight">
          {brand.name}
        </span>
      )}
    </Link>
  );
}

interface MarqueeRowProps {
  brands: PublicBrand[];
  reverse?: boolean;
}

export function MarqueeRow({ brands, reverse = false }: MarqueeRowProps) {
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
      className="overflow-hidden mask-x-from-90% mask-x-to-100% motion-reduce:mask-none"
    >
      <div
        ref={trackRef}
        style={{
          animationDuration: `${items.length * SECONDS_PER_ITEM}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
        className="flex w-max animate-marquee motion-reduce:w-full motion-reduce:animate-none"
      >
        <div className="flex shrink-0 items-center gap-10 pr-10 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0">
          {items.map((brand, index) => (
            <BrandLogo
              key={`${brand.slug}-${index}`}
              brand={brand}
              isRepeat={index >= brands.length}
            />
          ))}
        </div>
        <div
          aria-hidden
          className="flex shrink-0 items-center gap-10 pr-10 motion-reduce:hidden"
        >
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
