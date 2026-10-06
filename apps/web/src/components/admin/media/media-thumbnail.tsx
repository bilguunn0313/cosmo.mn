import { Play } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Media } from "@/lib/types";

interface MediaThumbnailProps {
  media: Media;
  className?: string;
  sizes?: string;
  fit?: "cover" | "contain";
}

export function MediaThumbnail({
  media,
  className,
  sizes = "200px",
  fit = "cover",
}: MediaThumbnailProps) {
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-lg bg-muted",
        className,
      )}
    >
      {media.type === "IMAGE" ? (
        <Image
          src={media.url}
          alt={media.originalName}
          fill
          unoptimized
          sizes={sizes}
          className={fit === "contain" ? "object-contain p-2" : "object-cover"}
        />
      ) : (
        <>
          <video
            src={media.url}
            preload="metadata"
            muted
            playsInline
            className="size-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
              <Play className="size-4 fill-current" />
            </span>
          </span>
        </>
      )}
    </div>
  );
}
