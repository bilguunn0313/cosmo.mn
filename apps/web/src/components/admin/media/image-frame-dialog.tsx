"use client";

import { MAX_MEDIA_ZOOM } from "@cosmo/shared";
import { Loader2, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CENTERED_FRAME, frameStyle, type ImageFrame } from "@/lib/image-frame";
import { useUpdateMediaFrame } from "@/lib/queries/media";
import type { Media } from "@/lib/types";

export interface FramePreview {
  label: string;
  ratio: number;
}

export const DEFAULT_FRAME_PREVIEWS: FramePreview[] = [
  { label: "Хэвтээ", ratio: 16 / 9 },
  { label: "Дөрвөлжин", ratio: 4 / 3 },
  { label: "Босоо", ratio: 4 / 5 },
];

const PREVIEW_HEIGHT = 132;
const ZOOM_STEP = 0.05;
const KEY_STEP = 1;
const FALLBACK_WIDTH = 1600;
const FALLBACK_HEIGHT = 1000;

const KEY_MOVES: Record<string, [number, number]> = {
  ArrowLeft: [-KEY_STEP, 0],
  ArrowRight: [KEY_STEP, 0],
  ArrowUp: [0, -KEY_STEP],
  ArrowDown: [0, KEY_STEP],
};

function clampPercent(value: number) {
  return Math.round(Math.min(100, Math.max(0, value)) * 10) / 10;
}

interface ImageFrameEditorProps {
  media: Media;
  previews: FramePreview[];
  onClose: () => void;
  onSaved: (media: Media) => void;
}

function ImageFrameEditor({
  media,
  previews,
  onClose,
  onSaved,
}: ImageFrameEditorProps) {
  const [frame, setFrame] = useState<ImageFrame>({
    focusX: media.focusX,
    focusY: media.focusY,
    zoom: media.zoom,
  });
  const updateFrame = useUpdateMediaFrame();
  const previewStyle = frameStyle(frame);

  const moveFocusTo = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    setFrame((current) => ({
      ...current,
      focusX: clampPercent(((event.clientX - box.left) / box.width) * 100),
      focusY: clampPercent(((event.clientY - box.top) / box.height) * 100),
    }));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    moveFocusTo(event);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      moveFocusTo(event);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const move = KEY_MOVES[event.key];

    if (!move) {
      return;
    }

    event.preventDefault();
    setFrame((current) => ({
      ...current,
      focusX: clampPercent(current.focusX + move[0]),
      focusY: clampPercent(current.focusY + move[1]),
    }));
  };

  const save = () => {
    updateFrame.mutate(
      { id: media.id, frame },
      {
        onSuccess: (updated) => {
          onSaved(updated);
          toast.success("Зургийн харагдах хэсэг хадгалагдлаа");
          onClose();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Зургийн харагдах хэсэг</DialogTitle>
        <DialogDescription>
          Зургийн хамгийн чухал хэсэг (жишээ нь хүний нүүр) дээр дарж эсвэл чирж
          гол цэгийг сонгоно уу. Сайт дэлгэц бүрт энэ цэгийг голд нь байлгаж
          тайрна. Тохиргоо энэ зураг ашиглагдсан бүх газарт үйлчилнэ.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="grid content-start gap-5">
          <div
            tabIndex={0}
            aria-label="Гол цэг. Сумтай товчоор зөөнө"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onKeyDown={handleKeyDown}
            className="relative mx-auto w-fit cursor-crosshair touch-none overflow-hidden rounded-lg bg-muted select-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Image
              src={media.url}
              alt={media.originalName}
              width={media.width ?? FALLBACK_WIDTH}
              height={media.height ?? FALLBACK_HEIGHT}
              unoptimized
              draggable={false}
              className="block h-auto max-h-[50vh] w-auto max-w-full"
            />
            <span
              aria-hidden
              style={{ left: `${frame.focusX}%`, top: `${frame.focusY}%` }}
              className="pointer-events-none absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary/40 shadow-md ring-2 ring-black/25"
            />
          </div>

          <label className="grid gap-2">
            <span className="flex justify-between text-sm">
              <span>Томруулах</span>
              <span className="text-muted-foreground tabular-nums">
                {frame.zoom.toFixed(2)}×
              </span>
            </span>
            <input
              type="range"
              min={1}
              max={MAX_MEDIA_ZOOM}
              step={ZOOM_STEP}
              value={frame.zoom}
              onChange={(event) =>
                setFrame((current) => ({
                  ...current,
                  zoom: Number(event.target.value),
                }))
              }
              className="w-full accent-primary"
            />
          </label>
        </div>

        <div className="grid content-start gap-3">
          <p className="text-sm font-medium">Сайт дээр ингэж харагдана</p>
          <div className="flex flex-wrap items-end gap-4">
            {previews.map((preview) => (
              <figure key={preview.label} className="grid gap-1.5">
                <div
                  style={{
                    height: PREVIEW_HEIGHT,
                    width: Math.round(PREVIEW_HEIGHT * preview.ratio),
                  }}
                  className="relative max-w-full overflow-hidden rounded-md bg-muted"
                >
                  <Image
                    src={media.url}
                    alt=""
                    fill
                    unoptimized
                    sizes="240px"
                    style={previewStyle}
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-xs text-muted-foreground">
                  {preview.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="ghost"
          onClick={() => setFrame(CENTERED_FRAME)}
          className="sm:mr-auto"
        >
          <RotateCcw />
          Голд нь буцаах
        </Button>
        <Button variant="outline" onClick={onClose}>
          Болих
        </Button>
        <Button onClick={save} disabled={updateFrame.isPending}>
          {updateFrame.isPending && <Loader2 className="animate-spin" />}
          Хадгалах
        </Button>
      </DialogFooter>
    </>
  );
}

interface ImageFrameDialogProps extends ImageFrameEditorProps {
  open: boolean;
}

export function ImageFrameDialog({
  open,
  onClose,
  ...editorProps
}: ImageFrameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <ImageFrameEditor onClose={onClose} {...editorProps} />
      </DialogContent>
    </Dialog>
  );
}
