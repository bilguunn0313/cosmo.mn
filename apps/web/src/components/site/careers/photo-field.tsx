"use client";

import { MAX_PHOTO_BYTES } from "@cosmo/shared";
import { Camera } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { errorClass, labelClass } from "@/components/site/form-styles";
import { cn } from "@/lib/utils";
import { RequiredMark } from "./form-fields";

const MAX_PHOTO_SIDE = 1200;
const JPEG_QUALITIES = [0.85, 0.7, 0.55];

export interface Photo {
  blob: Blob;
  url: string;
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
}

async function shrinkPhoto(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    MAX_PHOTO_SIDE / Math.max(bitmap.width, bitmap.height),
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  }
  bitmap.close();

  for (const quality of JPEG_QUALITIES) {
    const blob = await canvasToJpeg(canvas, quality);

    if (blob && blob.size <= MAX_PHOTO_BYTES) {
      return blob;
    }
  }

  return null;
}

function isImageFile(file: File) {
  return file.type === "" || file.type.startsWith("image/");
}

interface PhotoFieldProps {
  id: string;
  photo: Photo | null;
  onChange: (photo: Photo) => void;
  error?: string | null;
}

export function PhotoField({ id, photo, onChange, error }: PhotoFieldProps) {
  const t = useTranslations("careers.form");
  const [fileError, setFileError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const shownError = fileError ?? error;
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!isImageFile(file)) {
      setFileError(t("errors.photoType"));
      return;
    }

    setIsProcessing(true);
    const blob = await shrinkPhoto(file).catch(() => undefined);
    setIsProcessing(false);

    if (blob === undefined) {
      setFileError(t("errors.photoType"));
      return;
    }

    if (blob === null) {
      setFileError(t("errors.photoSize"));
      return;
    }

    if (photo) {
      URL.revokeObjectURL(photo.url);
    }

    setFileError(null);
    onChange({ blob, url: URL.createObjectURL(blob) });
  };

  return (
    <div className="grid content-start gap-1">
      <span className={labelClass}>
        <span id={labelId}>{t("fields.photo")}</span>
        <RequiredMark />
      </span>
      <label
        className={cn(
          "relative mt-1.5 flex aspect-3/4 w-37 cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-control border bg-paper text-center transition-colors duration-150 focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-brand",
          shownError && "border-danger",
          !shownError && photo && "border-brand-200",
          !shownError &&
            !photo &&
            "border-dashed border-ink/50 hover:border-brand hover:bg-brand-100",
        )}
      >
        <input
          id={id}
          type="file"
          accept="image/*"
          aria-labelledby={labelId}
          aria-required
          aria-invalid={Boolean(shownError)}
          aria-describedby={shownError ? `${hintId} ${errorId}` : hintId}
          onChange={handleFile}
          className="sr-only"
        />
        {photo ? (
          <>
            <Image
              src={photo.url}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
            <span className="absolute inset-x-0 bottom-0 bg-ink/65 py-1.5 text-xs font-medium text-white">
              {t("photoChange")}
            </span>
          </>
        ) : (
          <>
            <Camera className="size-6 text-brand" strokeWidth={1.7} />
            <span className="px-2 text-[13px] font-semibold text-ink">
              {isProcessing ? t("photoProcessing") : t("photoChoose")}
            </span>
          </>
        )}
      </label>
      <span id={hintId} className="w-37 text-xs leading-snug text-ink-3">
        {t("photoHint")}
      </span>
      {shownError && (
        <span id={errorId} className={errorClass}>
          {shownError}
        </span>
      )}
      <span aria-live="polite" className="sr-only">
        {photo ? t("photoAdded") : ""}
      </span>
    </div>
  );
}
