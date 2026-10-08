export interface AuthAdmin {
  id: number;
  email: string;
  name: string;
}

export interface Admin extends AuthAdmin {
  createdAt: string;
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
  | "slide"
  | "brand"
  | "brandSection"
  | "product"
  | "section"
  | "news"
  | "siteSetting";

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
  imageId: number | null;
  image: Media | null;
  linkUrl?: string | null;
  order: number;
  isVisible: boolean;
  translations: SectionTranslation[];
}

export type BrandCategory = "FOOD" | "BEAUTY" | "HOUSEHOLD";

export interface BrandTranslation {
  id: number;
  locale: Locale;
  name: string;
  summary: string | null;
}

export interface Brand {
  id: number;
  slug: string;
  categories: BrandCategory[];
  logoId: number | null;
  logo: Media | null;
  coverId: number | null;
  cover: Media | null;
  websiteUrl: string | null;
  order: number;
  isPublished: boolean;
  translations: BrandTranslation[];
}

export interface ProductTranslation {
  id: number;
  locale: Locale;
  name: string;
  description: string | null;
}

export interface Product {
  id: number;
  brandId: number;
  imageId: number;
  image: Media;
  order: number;
  isVisible: boolean;
  translations: ProductTranslation[];
}

export interface NewsTranslation {
  id: number;
  locale: Locale;
  title: string;
  summary: string | null;
  content: string;
}

export interface News {
  id: number;
  slug: string;
  coverImageId: number | null;
  coverImage: Media | null;
  videoId: number | null;
  video: Media | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  translations: NewsTranslation[];
}

export interface SiteSettingTranslation {
  id: number;
  locale: Locale;
  address: string | null;
  workingHours: string | null;
}

export interface SiteSetting {
  id: number;
  phone: string | null;
  email: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  linkedinUrl: string | null;
  mapUrl: string | null;
  mapImageId: number | null;
  mapImage: Media | null;
  translations: SiteSettingTranslation[];
}

export interface ContactDepartmentTranslation {
  id: number;
  locale: Locale;
  name: string;
}

export interface ContactDepartment {
  id: number;
  email: string;
  order: number;
  isActive: boolean;
  translations: ContactDepartmentTranslation[];
}

export interface MediaUsage {
  type: MediaUsageType;
  id: number;
  title: string;
}
