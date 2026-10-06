import {
  IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
  VIDEO_MIME_TYPES,
} from "@cosmo/shared";
import { ApiError } from "./api";
import type { Media, MediaType } from "./types";

export const ACCEPTED_FILE_TYPES: Record<MediaType, readonly string[]> = {
  IMAGE: IMAGE_MIME_TYPES,
  VIDEO: VIDEO_MIME_TYPES,
};

export function acceptAttribute(types: MediaType[]) {
  return types.flatMap((type) => ACCEPTED_FILE_TYPES[type]).join(",");
}

export function validateFile(file: File, allowedTypes: MediaType[]) {
  const isImage = IMAGE_MIME_TYPES.some((type) => type === file.type);
  const isVideo = VIDEO_MIME_TYPES.some((type) => type === file.type);

  if (isImage && allowedTypes.includes("IMAGE")) {
    return file.size > MAX_IMAGE_SIZE_BYTES
      ? "Зургийн хэмжээ 10MB-аас ихгүй байна"
      : null;
  }

  if (isVideo && allowedTypes.includes("VIDEO")) {
    return file.size > MAX_VIDEO_SIZE_BYTES
      ? "Видеоны хэмжээ 50MB-аас ихгүй байна"
      : null;
  }

  return allowedTypes.includes("VIDEO")
    ? "Зөвхөн JPG, PNG, WEBP зураг эсвэл MP4, WEBM видео оруулна уу"
    : "Зөвхөн JPG, PNG, WEBP зураг оруулна уу";
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function uploadErrorMessage(status: number, body: unknown) {
  if (status === 413) {
    return "Файл хэт том байна";
  }

  const message = (body as { message?: string } | null)?.message;
  return message ?? `Файл оруулж чадсангүй (${status})`;
}

export function uploadMedia(
  file: File,
  onProgress: (percent: number) => void,
): Promise<Media> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    request.addEventListener("load", () => {
      const body = parseJson(request.responseText);

      if (request.status >= 200 && request.status < 300) {
        resolve(body as Media);
        return;
      }

      reject(
        new ApiError(
          request.status,
          uploadErrorMessage(request.status, body),
          body,
        ),
      );
    });

    request.addEventListener("error", () => {
      reject(new ApiError(0, "Сервертэй холбогдож чадсангүй", null));
    });

    request.open("POST", "/api/admin/media");
    request.send(formData);
  });
}
