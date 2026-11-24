"use client";

import { useEffect, useRef } from "react";
import { LogoMark } from "@/components/site/logo-mark";

const VIEW_WIDTH = 1200;
const VIEW_HEIGHT = 440;
const HUB = { x: 600, y: 372 };
const ARC_RADIUS = { x: 500, y: 290 };
const ARC_START = 165;
const ARC_END = 15;
const BADGE_RADIUS = 42;
const LINE_STEP_MS = 140;
const DOT_SECONDS = 2.6;
const DOT_START_SECONDS = 1.9;
const VISIBLE_SHARE = 0.3;

export interface Channel {
  key: string;
  name: string;
  icon: React.ReactNode;
}

function arcAngles(count: number) {
  const step = (ARC_START - ARC_END) / (count - 1);

  return Array.from({ length: count }, (_, index) => ARC_START - index * step);
}

function arcPoint(degrees: number) {
  const radians = (degrees * Math.PI) / 180;

  return {
    x: Math.round(HUB.x + ARC_RADIUS.x * Math.cos(radians)),
    y: Math.round(HUB.y - ARC_RADIUS.y * Math.sin(radians)),
  };
}

function spokePath(to: { x: number; y: number }) {
  const middleY = (HUB.y + to.y) / 2;

  return `M${HUB.x} ${HUB.y - 46}C${HUB.x} ${middleY} ${to.x} ${middleY + 30} ${to.x} ${to.y + BADGE_RADIUS}`;
}

function dotStart(index: number, round: number) {
  return (DOT_START_SECONDS + index * 0.14 + round * (DOT_SECONDS / 2)).toFixed(
    2,
  );
}

function delay(milliseconds: number) {
  return { "--d": `${milliseconds}ms` } as React.CSSProperties;
}

interface ChannelNetworkProps {
  channels: Channel[];
  hubLabel: string;
}

export function ChannelNetwork({ channels, hubLabel }: ChannelNetworkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const points = arcAngles(channels.length).map(arcPoint);

  useEffect(() => {
    const element = ref.current;
    const svg = element?.querySelector("svg");

    if (!element || !svg) {
      return;
    }

    document.documentElement.dataset.revealReady = "true";
    svg.pauseAnimations();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !element.dataset.revealed) {
          element.dataset.revealed = "true";
          svg.setCurrentTime(0);
        }

        element.toggleAttribute("data-paused", !entry.isIntersecting);

        if (entry.isIntersecting && !reducedMotion.matches) {
          svg.unpauseAnimations();
        } else {
          svg.pauseAnimations();
        }
      },
      { threshold: VISIBLE_SHARE },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="channel-network mt-12 md:mt-16">
      <div className="relative mx-auto aspect-[1200/440] max-w-275 max-lg:hidden">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          aria-hidden
          className="absolute inset-0 size-full overflow-visible"
        >
          <defs>
            {points.map((point, index) => (
              <linearGradient
                key={channels[index].key}
                id={`channel-gradient-${index}`}
                gradientUnits="userSpaceOnUse"
                x1={point.x}
                y1={point.y}
                x2={HUB.x}
                y2={HUB.y}
              >
                <stop offset="0" stopColor="var(--color-amber)" />
                <stop offset="1" stopColor="var(--color-coral)" />
              </linearGradient>
            ))}
          </defs>
          {points.map((point, index) => (
            <path
              key={channels[index].key}
              id={`channel-spoke-${index}`}
              className="channel-line"
              pathLength={1}
              d={spokePath(point)}
              stroke={`url(#channel-gradient-${index})`}
              style={delay(300 + index * LINE_STEP_MS)}
            />
          ))}
          <g className="channel-dots">
            {channels.map((channel, index) =>
              [0, 1].map((round) => {
                const begin = `${dotStart(index, round)}s`;

                return (
                  <circle
                    key={`${channel.key}-${round}`}
                    r="3.5"
                    opacity="0"
                    className="channel-dot fill-white"
                  >
                    <set attributeName="opacity" to="1" begin={begin} />
                    <animateMotion
                      dur={`${DOT_SECONDS}s`}
                      begin={begin}
                      repeatCount="indefinite"
                    >
                      <mpath href={`#channel-spoke-${index}`} />
                    </animateMotion>
                  </circle>
                );
              }),
            )}
          </g>
        </svg>

        <div
          className="channel-hub absolute flex flex-col items-center gap-3"
          style={{
            left: `${(HUB.x / VIEW_WIDTH) * 100}%`,
            top: `${(HUB.y / VIEW_HEIGHT) * 100}%`,
          }}
        >
          <span className="relative grid size-28 place-items-center rounded-full bg-white text-brand">
            <span className="channel-ring absolute inset-0 rounded-full border-2 border-coral" />
            <span className="channel-ring channel-ring-late absolute inset-0 rounded-full border-2 border-coral" />
            <LogoMark className="w-13" />
          </span>
          <span className="font-display text-[13px] font-semibold tracking-[0.14em] whitespace-nowrap text-night-text uppercase">
            {hubLabel}
          </span>
        </div>

        <ul>
          {points.map((point, index) => (
            <li
              key={channels[index].key}
              className="channel-node absolute flex w-48 flex-col-reverse items-center gap-3 text-center"
              style={{
                left: `${(point.x / VIEW_WIDTH) * 100}%`,
                top: `${(point.y / VIEW_HEIGHT) * 100}%`,
                ...delay(900 + index * LINE_STEP_MS),
              }}
            >
              <span className="grid size-21 place-items-center rounded-full bg-white shadow-[0_12px_28px_-10px_rgb(11_31_51/0.55)] [&_svg]:size-11">
                {channels[index].icon}
              </span>
              <span className="font-display text-lg leading-snug font-semibold text-balance">
                {channels[index].name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:mx-auto md:w-fit lg:hidden">
        <div className="flex items-center gap-3.5">
          <span className="grid size-14 place-items-center rounded-full bg-white text-brand">
            <LogoMark className="w-7" />
          </span>
          <span className="font-display text-[13px] font-semibold tracking-[0.14em] text-night-text uppercase">
            {hubLabel}
          </span>
        </div>
        <ul className="relative flex flex-col pt-2 pl-7">
          <li
            aria-hidden
            className="channel-trunk absolute top-0 bottom-9 left-7 w-0.5 bg-linear-to-b from-coral to-amber"
          >
            <i className="channel-trunk-dot" />
            <i className="channel-trunk-dot" />
          </li>
          {channels.map((channel, index) => (
            <li
              key={channel.key}
              style={delay(500 + index * 120)}
              className="channel-branch relative flex items-center gap-3.5 py-2 pl-7.5 before:absolute before:top-1/2 before:left-0 before:h-0.5 before:w-7.5 before:bg-amber"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white shadow-[0_8px_20px_-8px_rgb(11_31_51/0.55)] [&_svg]:size-7">
                {channel.icon}
              </span>
              <span className="font-display text-base leading-snug font-semibold">
                {channel.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
