"use client";

import type { CountryCode } from "@cosmo/shared";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { brandPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import type { MapOrigin, MapPoint, WorldMapLayout } from "@/lib/world-map";

const WORLD_MAP_SRC = "/world-map.svg?v=3";
const ARC_LIFT = 0.3;
const ARC_STAGGER_SECONDS = 0.12;
const CLOSE_DELAY_MS = 150;
const MAX_TOOLTIP_BRANDS = 3;

function arcPath(from: MapPoint, to: MapPoint) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const controlX = (from.x + to.x) / 2;
  const controlY = (from.y + to.y) / 2 - distance * ARC_LIFT;

  return `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
}

function tooltipShift(ratio: number) {
  if (ratio > 0.8) {
    return "-90%";
  }

  return ratio < 0.2 ? "-10%" : "-50%";
}

interface CountryTooltipProps {
  origin: MapOrigin;
  layout: WorldMapLayout;
  countryName: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

function CountryTooltip({
  origin,
  layout,
  countryName,
  onPointerEnter,
  onPointerLeave,
}: CountryTooltipProps) {
  const shouldReduceMotion = useReducedMotion();
  const xRatio = origin.pin.x / layout.width;
  const shownBrands = origin.brands.slice(0, MAX_TOOLTIP_BRANDS);
  const hiddenCount = origin.brands.length - shownBrands.length;

  return (
    <motion.div
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      initial={
        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }
      }
      animate={{ opacity: 1, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
      style={{
        left: `${xRatio * 100}%`,
        top: `${(origin.pin.y / layout.height) * 100}%`,
        translate: `${tooltipShift(xRatio)} calc(-100% - 12px)`,
        transformOrigin: "bottom center",
      }}
      className="absolute z-10 flex items-center gap-3 rounded-full border border-white/15 bg-brand-night/85 py-1.5 pr-4 pl-1.5 text-sm whitespace-nowrap text-white shadow-lg backdrop-blur-md"
    >
      <span className="rounded-full bg-white/10 px-3 py-1 font-medium">
        {countryName}
      </span>
      {shownBrands.map((brand) => (
        <Link
          key={brand.slug}
          href={brandPath(brand.slug)}
          className="flex items-center gap-1.5 text-white/85 transition-colors duration-150 hover:text-white"
        >
          {brand.logoUrl && (
            <span className="relative size-5 overflow-hidden rounded-full bg-white">
              <Image
                src={brand.logoUrl}
                alt=""
                fill
                unoptimized
                sizes="20px"
                className="object-contain p-0.5"
              />
            </span>
          )}
          {brand.name}
        </Link>
      ))}
      {hiddenCount > 0 && (
        <span className="text-white/60 tabular-nums">+{hiddenCount}</span>
      )}
    </motion.div>
  );
}

interface WorldMapInteractiveProps {
  layout: WorldMapLayout;
  countryNames: Record<string, string>;
}

export function WorldMapInteractive({
  layout,
  countryNames,
}: WorldMapInteractiveProps) {
  const t = useTranslations("home");
  const shouldReduceMotion = useReducedMotion();
  const [activeCode, setActiveCode] = useState<CountryCode | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { width, height, mongolia, origins } = layout;
  const activeOrigin = origins.find((origin) => origin.code === activeCode);

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
  };

  const open = (code: CountryCode) => {
    cancelClose();
    setActiveCode(code);
  };

  const scheduleClose = () => {
    closeTimerRef.current = setTimeout(
      () => setActiveCode(null),
      CLOSE_DELAY_MS,
    );
  };

  const toggle = (code: CountryCode) =>
    setActiveCode((current) => (current === code ? null : code));

  return (
    <div
      className="relative mx-auto w-full max-w-[1400px]"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <Image src={WORLD_MAP_SRC} alt="" fill unoptimized />

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 size-full overflow-visible"
        aria-hidden
      >
        <defs>
          {origins.map((origin) => (
            <linearGradient
              key={origin.code}
              id={`arc-${origin.code}`}
              gradientUnits="userSpaceOnUse"
              x1={origin.pin.x}
              y1={origin.pin.y}
              x2={mongolia.pin.x}
              y2={mongolia.pin.y}
            >
              <stop offset="0%" stopColor="var(--color-brand-glow)" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
          ))}
          <filter
            id="mongolia-glow"
            x="-200%"
            y="-200%"
            width="500%"
            height="500%"
          >
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {mongolia.shape && (
          <path
            d={mongolia.shape}
            fill="white"
            opacity={0.92}
            stroke="white"
            strokeWidth={0.6}
          />
        )}

        {origins.map((origin, index) => {
          const isActive = activeCode === origin.code;
          const isDimmed = activeCode !== null && !isActive;

          return (
            <g
              key={origin.code}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") {
                  open(origin.code);
                }
              }}
              onPointerLeave={scheduleClose}
              onClick={() => toggle(origin.code)}
              className={cn(
                "cursor-pointer transition-opacity duration-200 ease-(--ease-out)",
                isDimmed && "opacity-30",
              )}
            >
              {origin.shape && (
                <path
                  d={origin.shape}
                  fill="var(--color-brand-glow)"
                  stroke={isActive ? "white" : "var(--color-brand-glow)"}
                  strokeWidth={isActive ? 1.2 : 0.6}
                  className="transition-[stroke] duration-150"
                />
              )}
              <motion.path
                d={arcPath(origin.pin, mongolia.pin)}
                fill="none"
                stroke={`url(#arc-${origin.code})`}
                strokeWidth={isActive ? 2.4 : 1.6}
                strokeLinecap="round"
                initial={
                  shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }
                }
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 1.2,
                  delay: index * ARC_STAGGER_SECONDS,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="pointer-events-none"
              />
              <circle
                cx={origin.pin.x}
                cy={origin.pin.y}
                r={16}
                fill="transparent"
              />
              <circle
                cx={origin.pin.x}
                cy={origin.pin.y}
                r={3.5}
                fill="white"
              />
            </g>
          );
        })}

        <circle
          cx={mongolia.pin.x}
          cy={mongolia.pin.y}
          r={16}
          fill="var(--color-brand-glow)"
          opacity={0.6}
          filter="url(#mongolia-glow)"
        />
        <circle
          cx={mongolia.pin.x}
          cy={mongolia.pin.y}
          r={5}
          fill="white"
          stroke="var(--color-brand-glow)"
          strokeWidth={2}
        />
      </svg>

      <AnimatePresence>
        {activeOrigin && (
          <CountryTooltip
            key="tooltip"
            origin={activeOrigin}
            layout={layout}
            countryName={countryNames[activeOrigin.code]}
            onPointerEnter={cancelClose}
            onPointerLeave={scheduleClose}
          />
        )}
      </AnimatePresence>

      <ul className="sr-only">
        {origins.map((origin) => (
          <li key={origin.code}>
            {countryNames[origin.code]}:{" "}
            {t("brandCount", { count: origin.brands.length })},{" "}
            {origin.brands.map((brand) => brand.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
