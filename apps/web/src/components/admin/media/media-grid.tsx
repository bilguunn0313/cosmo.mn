"use client";

import { Check, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes } from "@/lib/format";
import { useMediaLibrary } from "@/lib/queries/media";
import { cn } from "@/lib/utils";
import type { Media, MediaType } from "@/lib/types";
import { MediaThumbnail } from "./media-thumbnail";

interface MediaGridProps {
  type: MediaType | undefined;
  selectedId?: number | null;
  onSelect: (media: Media) => void;
  columnsClassName?: string;
}

const DEFAULT_COLUMNS =
  "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";

export function MediaGrid({
  type,
  selectedId,
  onSelect,
  columnsClassName = DEFAULT_COLUMNS,
}: MediaGridProps) {
  const library = useMediaLibrary(type);
  const items = library.data?.pages.flatMap((page) => page.items) ?? [];

  if (library.isPending) {
    return (
      <div className={cn("grid gap-3", columnsClassName)}>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
        <ImageOff className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Одоогоор файл алга</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <ul className={cn("grid gap-3", columnsClassName)}>
        {items.map((media) => {
          const isSelected = media.id === selectedId;

          return (
            <li key={media.id}>
              <button
                type="button"
                onClick={() => onSelect(media)}
                aria-pressed={isSelected}
                className={cn(
                  "group relative grid w-full gap-1.5 rounded-xl p-1.5 text-left outline-none transition-[background-color,scale] duration-150 ease-(--ease-out) hover:bg-muted motion-safe:active:scale-[0.98] focus-visible:ring-3 focus-visible:ring-ring/50",
                  isSelected && "bg-primary/10 ring-2 ring-primary",
                )}
              >
                <MediaThumbnail media={media} />
                {isSelected && (
                  <span className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" />
                  </span>
                )}
                <span className="truncate px-0.5 text-xs font-medium">
                  {media.originalName}
                </span>
                <span className="px-0.5 text-xs text-muted-foreground">
                  {formatBytes(media.size)}
                  {media.width && media.height
                    ? ` · ${media.width}×${media.height}`
                    : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {library.hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => void library.fetchNextPage()}
            disabled={library.isFetchingNextPage}
          >
            Цааш үзэх
          </Button>
        </div>
      )}
    </div>
  );
}
