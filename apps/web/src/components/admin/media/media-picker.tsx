"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Media, MediaType } from "@/lib/types";
import { MediaGrid } from "./media-grid";
import { MediaTypeTabs } from "./media-type-tabs";
import { UploadDropzone } from "./upload-dropzone";

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: Media) => void;
  allowedTypes?: MediaType[];
  title?: string;
}

export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  allowedTypes = ["IMAGE"],
  title = "Зураг сонгох",
}: MediaPickerProps) {
  const allowsBoth = allowedTypes.length > 1;
  const [type, setType] = useState<MediaType | undefined>(
    allowsBoth ? undefined : allowedTypes[0],
  );
  const [selected, setSelected] = useState<Media | null>(null);

  const confirm = (media: Media | null) => {
    if (!media) {
      return;
    }

    onSelect(media);
    setSelected(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90svh] flex-col sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Зургийн сангаас сонгох эсвэл шинээр оруулна уу.
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-1 grid flex-1 gap-4 overflow-y-auto px-1 py-1">
          <UploadDropzone
            compact
            allowedTypes={allowedTypes}
            onUploaded={setSelected}
          />
          {allowsBoth && <MediaTypeTabs value={type} onChange={setType} />}
          <MediaGrid
            type={type}
            selectedId={selected?.id}
            onSelect={setSelected}
            columnsClassName="grid-cols-2 sm:grid-cols-4 md:grid-cols-5"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Болих
          </Button>
          <Button disabled={!selected} onClick={() => confirm(selected)}>
            Сонгох
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
