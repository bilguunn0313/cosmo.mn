"use client";

import { useEffect, useRef } from "react";
import { LogoMark } from "@/components/site/logo-mark";

const VIEW_WIDTH = 1200;
const VIEW_HEIGHT = 440;
const HUB = { x: 600, y: 372 };
const ARC_RADIUS = { x: 500, y: 290 };
const ARC_ANGLES = [165, 135, 105, 75, 45, 15];
const BADGE_RADIUS = 42;
const LINE_STEP_MS = 140;
const DOT_SECONDS = 2.6;
const DOT_START_SECONDS = 1.9;
const VISIBLE_SHARE = 0.3;

export interface Channel {
  key: string;
  label: string;
  icon: React.ReactNode;
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
  const points = ARC_ANGLES.map(arcPoint);

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
          {points.map((point, index) => (
            <path
              key={channels[index].key}
              id={`channel-spoke-${index}`}
              className="channel-line"
              pathLength={1}
              d={spokePath(point)}
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
                    r="4"
                    opacity="0"
                    className="fill-amber"
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
            <span className="channel-ring absolute inset-0 rounded-full border-2 border-white" />
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
              className="channel-node absolute flex w-40 flex-col-reverse items-center gap-3 text-center"
              style={{
                left: `${(point.x / VIEW_WIDTH) * 100}%`,
                top: `${(point.y / VIEW_HEIGHT) * 100}%`,
                ...delay(900 + index * LINE_STEP_MS),
              }}
            >
              <span className="grid size-21 place-items-center rounded-full bg-white/10 ring-1 ring-white/30 ring-inset [&_svg]:size-9">
                {channels[index].icon}
              </span>
              <span className="font-display text-[17px] leading-snug font-medium text-balance">
                {channels[index].label}
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
            className="channel-trunk absolute top-0 bottom-9 left-7 w-0.5 bg-white/30"
          >
            <i className="channel-trunk-dot" />
            <i className="channel-trunk-dot" />
          </li>
          {channels.map((channel, index) => (
            <li
              key={channel.key}
              style={delay(500 + index * 120)}
              className="channel-branch relative flex items-center gap-3.5 py-2 pl-7.5 before:absolute before:top-1/2 before:left-0 before:h-0.5 before:w-7.5 before:bg-white/30"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/30 ring-inset [&_svg]:size-6.5">
                {channel.icon}
              </span>
              <span className="font-display text-base leading-snug font-medium">
                {channel.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
