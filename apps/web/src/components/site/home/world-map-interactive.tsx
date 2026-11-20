"use client";

import type { CountryCode } from "@cosmo/shared";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CountryFlag } from "@/components/site/country-flag";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";
import type { MapPoint, WorldMapLayout } from "@/lib/world-map";

const WORLD_MAP_SRC = "/world-map.svg?v=6";
const ARC_LIFT = 0.32;
const MIN_ARC_LIFT = 40;
const ARC_STEP_MS = 220;
const COMET_SECONDS = 2.8;
const COMET_START_SECONDS = 2.4;
const COMET_STEP_SECONDS = 0.35;
const VISIBLE_SHARE = 0.25;

function roundTenth(value: number) {
  return Math.round(value * 10) / 10;
}

function arcPath(from: MapPoint, to: MapPoint) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  const lift = Math.max(MIN_ARC_LIFT, distance * ARC_LIFT);
  const side = dx >= 0 ? 1 : -1;
  const controlX = roundTenth(
    (from.x + to.x) / 2 + ((side * dy) / distance) * lift,
  );
  const controlY = roundTenth(
    (from.y + to.y) / 2 - ((side * dx) / distance) * lift,
  );

  return `M${from.x} ${from.y}Q${controlX} ${controlY} ${to.x} ${to.y}`;
}

function delay(milliseconds: number) {
  return { "--d": `${milliseconds}ms` } as React.CSSProperties;
}

function percent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

interface WorldMapInteractiveProps {
  layout: WorldMapLayout;
  countryNames: Record<string, string>;
  mongoliaName: string;
  children: React.ReactNode;
}

export function WorldMapInteractive({
  layout,
  countryNames,
  mongoliaName,
  children,
}: WorldMapInteractiveProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeCode, setActiveCode] = useState<CountryCode | null>(null);
  const { width, height, mongolia, origins } = layout;

  useEffect(() => {
    const stage = stageRef.current;
    const svg = stage?.querySelector("svg");

    if (!stage || !svg) {
      return;
    }

    document.documentElement.dataset.revealReady = "true";
    svg.pauseAnimations();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !stage.dataset.revealed) {
          stage.dataset.revealed = "true";
          svg.setCurrentTime(0);
        }

        stage.toggleAttribute("data-paused", !entry.isIntersecting);

        if (entry.isIntersecting && !reducedMotion.matches) {
          svg.unpauseAnimations();
        } else {
          svg.pauseAnimations();
        }
      },
      { threshold: VISIBLE_SHARE },
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const isDimmed = (code: CountryCode) =>
    activeCode !== null && activeCode !== code;

  return (
    <div className="py-12 md:py-14">
      <div className="site-container">
        <Reveal className="mx-auto flex max-w-200 flex-col items-center gap-3 text-center">
          {children}
        </Reveal>
      </div>

      <div
        ref={stageRef}
        className="world-stage relative mx-auto mt-6 max-sm:-ml-[19.5%] max-sm:w-[135%] md:mt-8"
        style={
          {
            aspectRatio: `${width} / ${height}`,
            "--world-ratio": width / height,
          } as React.CSSProperties
        }
      >
        <Image src={WORLD_MAP_SRC} alt="" fill unoptimized />

        <svg
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden
          className="absolute inset-0 size-full overflow-visible"
        >
          <defs>
            {origins.map((origin) => (
              <linearGradient
                key={origin.code}
                id={`world-arc-${origin.code}`}
                gradientUnits="userSpaceOnUse"
                x1={origin.pin.x}
                y1={origin.pin.y}
                x2={mongolia.pin.x}
                y2={mongolia.pin.y}
              >
                <stop offset="0" stopColor="var(--color-amber)" />
                <stop offset="1" stopColor="var(--color-coral)" />
              </linearGradient>
            ))}
            <radialGradient id="world-mongolia-glow">
              <stop
                offset="0"
                stopColor="var(--color-coral)"
                stopOpacity="0.55"
              />
              <stop offset="1" stopColor="var(--color-coral)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <path
            className="world-dots fill-amber"
            d={origins.map((origin) => origin.dots).join("")}
          />
          <path className="fill-coral" d={mongolia.dots} />
          <circle
            cx={mongolia.pin.x}
            cy={mongolia.pin.y}
            r="70"
            fill="url(#world-mongolia-glow)"
          />

          {origins.map((origin, index) => (
            <path
              key={origin.code}
              className={cn("world-arc", isDimmed(origin.code) && "opacity-15")}
              pathLength={1}
              d={arcPath(origin.pin, mongolia.pin)}
              stroke={`url(#world-arc-${origin.code})`}
              style={delay(400 + index * ARC_STEP_MS)}
            />
          ))}

          <g className="world-comets">
            {origins.map((origin, index) => {
              const begin = `${(COMET_START_SECONDS + index * COMET_STEP_SECONDS).toFixed(2)}s`;

              return (
                <circle
                  key={origin.code}
                  r="3"
                  opacity="0"
                  className={cn(
                    "world-comet fill-white",
                    isDimmed(origin.code) && "hidden",
                  )}
                >
                  <set attributeName="opacity" to="1" begin={begin} />
                  <animateMotion
                    dur={`${COMET_SECONDS}s`}
                    begin={begin}
                    repeatCount="indefinite"
                    path={arcPath(origin.pin, mongolia.pin)}
                  />
                </circle>
              );
            })}
          </g>

          {origins.map((origin, index) => (
            <g
              key={origin.code}
              className="world-pin"
              style={delay(300 + index * ARC_STEP_MS)}
            >
              <circle
                className="world-pin-ring stroke-amber"
                cx={origin.pin.x}
                cy={origin.pin.y}
                r="5"
              />
              <circle
                className="fill-amber"
                cx={origin.pin.x}
                cy={origin.pin.y}
                r={activeCode === origin.code ? 5.5 : 4}
              />
            </g>
          ))}

          <circle
            className="world-ring stroke-coral"
            cx={mongolia.pin.x}
            cy={mongolia.pin.y}
            r="8"
          />
          <circle
            className="world-ring world-ring-late stroke-coral"
            cx={mongolia.pin.x}
            cy={mongolia.pin.y}
            r="8"
          />
          <circle
            className="fill-white"
            cx={mongolia.pin.x}
            cy={mongolia.pin.y}
            r="6"
          />
          <circle
            className="fill-coral"
            cx={mongolia.pin.x}
            cy={mongolia.pin.y}
            r="3"
          />
        </svg>

        <span
          className="absolute rounded-full bg-white px-3 py-1 font-display text-xs font-semibold text-brand-700 max-sm:hidden"
          style={{
            left: percent(mongolia.pin.x, width),
            top: percent(mongolia.pin.y, height),
            translate: "14px calc(-100% - 8px)",
          }}
        >
          {mongoliaName}
        </span>
      </div>

      <div className="site-container">
        <ul className="mt-6 flex flex-wrap justify-center gap-2 md:mt-8">
          {origins.map((origin) => (
            <li key={origin.code}>
              <button
                type="button"
                aria-pressed={activeCode === origin.code}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") {
                    setActiveCode(origin.code);
                  }
                }}
                onPointerLeave={() => setActiveCode(null)}
                onFocus={() => setActiveCode(origin.code)}
                onBlur={() => setActiveCode(null)}
                onClick={() =>
                  setActiveCode((current) =>
                    current === origin.code ? null : origin.code,
                  )
                }
                className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/6 py-1.5 pr-3.5 pl-2 text-[13px] font-medium text-white transition-[background-color,border-color] duration-200 hover:border-amber/70 hover:bg-amber/16 aria-pressed:border-amber/70 aria-pressed:bg-amber/16 md:text-sm"
              >
                <CountryFlag
                  code={origin.code}
                  className="rounded-[3px] shadow-[0_0_0_1px_rgb(255_255_255/0.25)]"
                />
                {countryNames[origin.code]}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
