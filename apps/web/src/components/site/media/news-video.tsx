"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const WIDE_RATIO = 1.7;

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

interface VideoShape {
  duration: number;
  ratio: number;
}

interface NewsVideoProps {
  src: string;
  poster: string | null;
  playLabel: string;
}

export function NewsVideo({ src, poster, playLabel }: NewsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [shape, setShape] = useState<VideoShape | null>(null);
  const isPortrait = shape !== null && shape.ratio < 1;
  const hasSideBars = shape !== null && shape.ratio < WIDE_RATIO;

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const readShape = () => {
      if (video.videoHeight > 0) {
        setShape({
          duration: video.duration,
          ratio: video.videoWidth / video.videoHeight,
        });
      }
    };

    readShape();
    video.addEventListener("loadedmetadata", readShape);
    return () => video.removeEventListener("loadedmetadata", readShape);
  }, [src]);

  const start = () => {
    const video = videoRef.current;
    setIsStarted(true);

    if (video) {
      video.focus();
      video.play().catch(() => null);
    }
  };

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-card bg-brand-night",
        isPortrait ? "aspect-4/5 md:aspect-video" : "aspect-video",
      )}
    >
      {poster && hasSideBars && (
        <Image
          src={poster}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="-z-10 scale-110 object-cover opacity-50 blur-2xl"
        />
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster ?? undefined}
        controls={isStarted}
        playsInline
        preload="metadata"
        className="absolute inset-0 size-full object-contain outline-brand focus-visible:outline-2"
      />

      {!isStarted && (
        <button
          type="button"
          onClick={start}
          aria-label={playLabel}
          className="group absolute inset-0 grid cursor-pointer place-items-center outline-none"
        >
          <span className="grid size-18 place-items-center rounded-full bg-white text-brand shadow-[0_24px_48px_-20px_rgb(11_31_51/0.7)] transition-[scale] duration-200 ease-out group-hover:scale-106 group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-white group-active:scale-96 motion-reduce:transition-none md:size-23">
            <Play className="size-7 translate-x-0.5 fill-current md:size-8" />
          </span>
          {shape && (
            <span className="absolute bottom-4 left-4 rounded-lg bg-brand-night/75 px-2.5 py-1.5 text-[13px] font-medium text-white tabular-nums md:bottom-5 md:left-5">
              {formatDuration(shape.duration)}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
