"use client";

import { ImagePlus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Media, MediaType } from "@/lib/types";
import { MediaPicker } from "./media-picker";
import { MediaThumbnail } from "./media-thumbnail";

interface MediaFieldProps {
  value: Media | null;
  onChange: (media: Media | null) => void;
  allowedTypes?: MediaType[];
  pickerTitle?: string;
  removable?: boolean;
  invalid?: boolean;
}

function chooseLabelFor(allowedTypes: MediaType[]) {
  if (!allowedTypes.includes("IMAGE")) {
    return "Видео сонгох";
  }

  return allowedTypes.includes("VIDEO")
    ? "Видео эсвэл зураг сонгох"
    : "Зураг сонгох";
}

export function MediaField({
  value,
  onChange,
  allowedTypes = ["IMAGE"],
  pickerTitle,
  removable = false,
  invalid = false,
}: MediaFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const chooseLabel = chooseLabelFor(allowedTypes);

  return (
    <>
      {value ? (
        <div className="flex items-center gap-4">
          <MediaThumbnail
            media={value}
            className="aspect-video w-40 shrink-0"
          />
          <div className="grid min-w-0 gap-2">
            <span className="truncate text-sm">{value.originalName}</span>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPickerOpen(true)}
              >
                Солих
              </Button>
              {removable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange(null)}
                >
                  <X />
                  Хасах
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          data-invalid={invalid || undefined}
          className="flex aspect-video w-40 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted/60 data-invalid:border-destructive"
        >
          <ImagePlus className="size-5" />
          <span className="px-2 text-center text-xs">{chooseLabel}</span>
        </button>
      )}

      <MediaPicker
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        onSelect={onChange}
        allowedTypes={allowedTypes}
        title={pickerTitle ?? chooseLabel}
      />
    </>
  );
}
