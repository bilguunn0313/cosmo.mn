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

const STOCK_PHOTO = (id: string) =>
  `https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=crop`;

export const VALUE_IMAGE_PLACEHOLDERS: Record<ValueKey, string> = {
  people: STOCK_PHOTO("photo-1702468049239-49fd1cf99d20"),
  satisfaction: STOCK_PHOTO("photo-1556740758-90de374c12ad"),
  quality: STOCK_PHOTO("photo-1586528116022-aeda1613c63d"),
  responsibility: STOCK_PHOTO("photo-1593113598332-cd288d649433"),
};

interface AboutContent {
  ceoPhotoUrl: string | null;
  sloganImageUrl: string | null;
}

export const ABOUT_CONTENT: AboutContent = {
  ceoPhotoUrl: null,
  sloganImageUrl: null,
};
