export const VALUE_KEYS = [
  "people",
  "satisfaction",
  "quality",
  "responsibility",
] as const;

export type ValueKey = (typeof VALUE_KEYS)[number];

export const CEO_PHOTO_PLACEHOLDER =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop";

export const SLOGAN_IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1600&q=80&auto=format&fit=crop";

interface AboutContent {
  ceoPhotoUrl: string | null;
  sloganImageUrl: string | null;
}

export const ABOUT_CONTENT: AboutContent = {
  ceoPhotoUrl: null,
  sloganImageUrl: null,
};
