interface FramedMedia {
  url: string;
  focusX: number;
  focusY: number;
  zoom: number;
}

const CENTER = 50;
const NO_ZOOM = 1;

export function framedImageUrl(media: FramedMedia): string;
export function framedImageUrl(
  media: FramedMedia | null | undefined,
): string | null;
export function framedImageUrl(media: FramedMedia | null | undefined) {
  if (!media) {
    return null;
  }

  const { url, focusX, focusY, zoom } = media;
  const isCentered = focusX === CENTER && focusY === CENTER && zoom === NO_ZOOM;

  return isCentered ? url : `${url}?frame=${focusX},${focusY},${zoom}`;
}
