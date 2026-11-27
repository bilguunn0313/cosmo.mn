"use client";

import { ArrowLeft, ArrowRight, ImagePlus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Media } from "@/lib/types";
import { MediaPicker } from "./media-picker";
import { MediaThumbnail } from "./media-thumbnail";

interface MediaListFieldProps {
  value: Media[];
  onChange: (media: Media[]) => void;
  max: number;
  pickerTitle?: string;
}

function moveItem(items: Media[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function MediaListField({
  value,
  onChange,
  max,
  pickerTitle = "Зураг нэмэх",
}: MediaListFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const canAdd = value.length < max;

  const add = (media: Media) => {
    if (!value.some((item) => item.id === media.id)) {
      onChange([...value, media]);
    }
  };

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {value.map((media, index) => (
          <li key={media.id} className="grid gap-1.5">
            <MediaThumbnail media={media} className="aspect-video w-full" />
            <div className="flex items-center justify-between gap-1">
              <span className="pl-1 text-xs text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Өмнө нь шилжүүлэх"
                  disabled={index === 0}
                  onClick={() => onChange(moveItem(value, index, index - 1))}
                >
                  <ArrowLeft />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Хойно нь шилжүүлэх"
                  disabled={index === value.length - 1}
                  onClick={() => onChange(moveItem(value, index, index + 1))}
                >
                  <ArrowRight />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Хасах"
                  onClick={() =>
                    onChange(value.filter((item) => item.id !== media.id))
                  }
                >
                  <X />
                </Button>
              </div>
            </div>
          </li>
        ))}

        {canAdd && (
          <li>
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="flex aspect-video w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted/60"
            >
              <ImagePlus className="size-5" />
              <span className="text-xs">Зураг нэмэх</span>
            </button>
          </li>
        )}
      </ul>

      <MediaPicker
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        onSelect={add}
        title={pickerTitle}
      />
    </>
  );
}
