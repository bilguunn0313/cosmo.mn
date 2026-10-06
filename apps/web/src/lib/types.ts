export interface AuthAdmin {
  id: number;
  email: string;
  name: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type MediaType = "IMAGE" | "VIDEO";

export interface Media {
  id: number;
  type: MediaType;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  createdAt: string;
}

export type MediaUsageType =
  "slide" | "brand" | "brandSection" | "section" | "news";

export type Locale = "mn" | "en" | "zh";

export interface SlideTranslation {
  id: number;
  locale: Locale;
  title: string;
  subtitle: string | null;
  buttonText: string | null;
}

export interface Slide {
  id: number;
  mediaId: number;
  media: Media;
  posterId: number | null;
  poster: Media | null;
  linkUrl: string | null;
  order: number;
  isActive: boolean;
  translations: SlideTranslation[];
}

export type SectionPage = "home" | "about" | "human-resources";

export interface SectionTranslation {
  id: number;
  locale: Locale;
  title: string;
  body: string;
}

export interface Section {
  id: number;
  page: SectionPage;
  imageId: number | null;
  image: Media | null;
  linkUrl: string | null;
  order: number;
  isVisible: boolean;
  translations: SectionTranslation[];
}

export interface MediaUsage {
  type: MediaUsageType;
  id: number;
  title: string;
}
