export const VALUE_KEYS = [
  "people",
  "satisfaction",
  "quality",
  "responsibility",
] as const;

export type ValueKey = (typeof VALUE_KEYS)[number];

interface AboutContent {
  ceoPhotoUrl: string | null;
  valueImageUrls: Record<ValueKey, string | null>;
}

export const ABOUT_CONTENT: AboutContent = {
  ceoPhotoUrl: null,
  valueImageUrls: {
    people: null,
    satisfaction: null,
    quality: null,
    responsibility: null,
  },
};
