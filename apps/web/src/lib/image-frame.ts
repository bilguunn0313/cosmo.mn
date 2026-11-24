import type { CSSProperties } from "react";

export interface ImageFrame {
  focusX: number;
  focusY: number;
  zoom: number;
}

export const CENTERED_FRAME: ImageFrame = { focusX: 50, focusY: 50, zoom: 1 };

const FRAME_IN_URL = /[?&]frame=([\d.]+),([\d.]+),([\d.]+)/;

export function frameStyle({
  focusX,
  focusY,
  zoom,
}: ImageFrame): CSSProperties {
  const focusPoint = `${focusX}% ${focusY}%`;

  return {
    objectPosition: focusPoint,
    transformOrigin: focusPoint,
    transform: zoom > 1 ? `scale(${zoom})` : undefined,
  };
}

export function imageFrameStyle(src: string | null | undefined) {
  const match = src?.match(FRAME_IN_URL);

  if (!match) {
    return undefined;
  }

  const [focusX, focusY, zoom] = match.slice(1).map(Number);
  return frameStyle({ focusX, focusY, zoom });
}
