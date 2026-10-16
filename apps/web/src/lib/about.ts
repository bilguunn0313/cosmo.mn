export const VALUE_KEYS = [
  "people",
  "satisfaction",
  "quality",
  "responsibility",
] as const;

export type ValueKey = (typeof VALUE_KEYS)[number];

interface AboutContent {
  bannerImageUrl: string | null;
  ceoPhotoUrl: string | null;
  valueImageUrls: Record<ValueKey, string | null>;
}

export const ABOUT_CONTENT: AboutContent = {
  bannerImageUrl: null,
  ceoPhotoUrl: null,
  valueImageUrls: {
    people: null,
    satisfaction: null,
    quality: null,
    responsibility: null,
  },
};
