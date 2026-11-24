"use client";

import { Crop, ImagePlus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Media, MediaType } from "@/lib/types";
import { type FramePreview, ImageFrameDialog } from "./image-frame-dialog";
import { MediaPicker } from "./media-picker";
import { MediaThumbnail } from "./media-thumbnail";

interface MediaFieldProps {
  value: Media | null;
  onChange: (media: Media | null) => void;
  allowedTypes?: MediaType[];
  pickerTitle?: string;
  removable?: boolean;
  invalid?: boolean;
  framePreviews?: FramePreview[];
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
  framePreviews,
}: MediaFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isFrameOpen, setIsFrameOpen] = useState(false);
  const [frameSession, setFrameSession] = useState(0);
  const canAdjustFrame = Boolean(framePreviews) && value?.type === "IMAGE";

  const openFrameEditor = () => {
    setFrameSession((session) => session + 1);
    setIsFrameOpen(true);
  };
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
              {canAdjustFrame && (
                <Button variant="outline" size="sm" onClick={openFrameEditor}>
                  <Crop />
                  Тохируулах
                </Button>
              )}
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

      {value && framePreviews && (
        <ImageFrameDialog
          key={frameSession}
          open={isFrameOpen}
          media={value}
          previews={framePreviews}
          onClose={() => setIsFrameOpen(false)}
          onSaved={onChange}
        />
      )}
    </>
  );
}
