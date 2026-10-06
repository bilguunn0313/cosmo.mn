"use client";

import { CheckCircle2, CircleAlert, Upload } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useInvalidateMedia } from "@/lib/queries/media";
import { cn } from "@/lib/utils";
import type { Media, MediaType } from "@/lib/types";
import { acceptAttribute, uploadMedia, validateFile } from "@/lib/upload";

type UploadStatus = "uploading" | "done" | "error";

interface UploadItem {
  key: string;
  name: string;
  progress: number;
  status: UploadStatus;
  error?: string;
}

interface UploadDropzoneProps {
  allowedTypes?: MediaType[];
  onUploaded?: (media: Media) => void;
  compact?: boolean;
}

const DONE_ITEM_LIFETIME_MS = 2500;

function hintText(allowedTypes: MediaType[]) {
  const parts = ["Зураг: JPG, PNG, WEBP, 10MB хүртэл"];

  if (allowedTypes.includes("VIDEO")) {
    parts.push("Видео: MP4, WEBM, 50MB хүртэл");
  }

  return parts.join(" · ");
}

export function UploadDropzone({
  allowedTypes = ["IMAGE", "VIDEO"],
  onUploaded,
  compact = false,
}: UploadDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const invalidateMedia = useInvalidateMedia();
  const [isDragging, setIsDragging] = useState(false);
  const [items, setItems] = useState<UploadItem[]>([]);

  const updateItem = (key: string, changes: Partial<UploadItem>) => {
    setItems((current) =>
      current.map((item) =>
        item.key === key ? { ...item, ...changes } : item,
      ),
    );
  };

  const removeItemLater = (key: string) => {
    setTimeout(() => {
      setItems((current) => current.filter((item) => item.key !== key));
    }, DONE_ITEM_LIFETIME_MS);
  };

  const uploadOne = async (file: File) => {
    const key = `${file.name}-${file.size}-${Date.now()}`;
    const validationError = validateFile(file, allowedTypes);

    setItems((current) => [
      ...current,
      {
        key,
        name: file.name,
        progress: 0,
        status: validationError ? "error" : "uploading",
        error: validationError ?? undefined,
      },
    ]);

    if (validationError) {
      return;
    }

    try {
      const media = await uploadMedia(file, (progress) =>
        updateItem(key, { progress }),
      );
      updateItem(key, { status: "done", progress: 100 });
      removeItemLater(key);
      onUploaded?.(media);
    } catch (error) {
      updateItem(key, {
        status: "error",
        error: error instanceof Error ? error.message : "Алдаа гарлаа",
      });
    }
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    for (const file of Array.from(files)) {
      await uploadOne(file);
    }

    await invalidateMedia();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    void uploadFiles(event.dataTransfer.files);
  };

  return (
    <div className="grid gap-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center transition-colors duration-150",
          compact ? "px-4 py-5" : "px-6 py-10",
          isDragging ? "border-primary bg-primary/5" : "bg-muted/30",
        )}
      >
        <Upload className="size-5 text-muted-foreground" />
        <p className="text-sm">
          Файлаа энд чирж оруулна уу эсвэл{" "}
          <Button
            variant="link"
            className="h-auto p-0"
            onClick={() => inputRef.current?.click()}
          >
            компьютерээс сонгох
          </Button>
        </p>
        <p className="text-xs text-muted-foreground">
          {hintText(allowedTypes)}
        </p>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          multiple
          accept={acceptAttribute(allowedTypes)}
          className="sr-only"
          onChange={(event) => {
            void uploadFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {items.length > 0 && (
        <ul className="grid gap-2">
          {items.map((item) => (
            <li
              key={item.key}
              className="grid gap-1.5 rounded-lg border px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                {item.status === "done" && (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                )}
                {item.status === "error" && (
                  <CircleAlert className="size-4 text-destructive" />
                )}
                <span className="truncate">{item.name}</span>
                {item.status === "uploading" && (
                  <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                    {item.progress}%
                  </span>
                )}
              </div>
              {item.status === "uploading" && (
                <div className="h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full origin-left rounded-full bg-primary transition-transform duration-200 ease-linear"
                    style={{ transform: `scaleX(${item.progress / 100})` }}
                  />
                </div>
              )}
              {item.error && (
                <p className="text-xs text-destructive">{item.error}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
