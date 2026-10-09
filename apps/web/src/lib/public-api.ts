import type { BrandCategory, CountryCode } from "@cosmo/shared";
import type { Locale } from "./types";

export const API_URL = process.env.API_URL ?? "http://localhost:4000";
export const PUBLIC_CONTENT_TAG = "public-content";
const REVALIDATE_SECONDS = 300;

export async function fetchPublic<T>(path: string, locale: Locale): Promise<T> {
  const url = new URL(path, API_URL);
  url.searchParams.set("locale", locale);

  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS, tags: [PUBLIC_CONTENT_TAG] },
  });

  if (!response.ok) {
    throw new Error(`${path} ${response.status}`);
  }

  return (await response.json()) as T;
}

export interface PublicSiteSetting {
  phone: string | null;
  email: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  linkedinUrl: string | null;
  mapUrl: string | null;
  mapImageUrl: string | null;
  foundedYear: number | null;
  employeeCount: number | null;
  partnerCount: number | null;
  categoryImages: Record<BrandCategory, string | null>;
  address: string | null;
  workingHours: string | null;
}

export interface PublicSlide {
  id: number;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  posterUrl: string | null;
  linkUrl: string | null;
  title: string;
  subtitle: string | null;
  buttonText: string | null;
}

export function fetchSlides(locale: Locale) {
  return fetchPublic<PublicSlide[]>("/public/slides", locale).catch(
    (): PublicSlide[] => [],
  );
}

export interface PublicBrand {
  slug: string;
  categories: BrandCategory[];
  name: string;
  summary: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  originCountry: CountryCode | null;
}

export function fetchBrands(locale: Locale) {
  return fetchPublic<PublicBrand[]>("/public/brands", locale).catch(
    (): PublicBrand[] => [],
  );
}

export interface PublicNewsItem {
  slug: string;
  title: string;
  summary: string | null;
  coverUrl: string | null;
  videoUrl: string | null;
  publishedAt: string;
}

interface PublicNewsPage {
  items: PublicNewsItem[];
  total: number;
}

export function fetchLatestNews(locale: Locale, limit: number) {
  return fetchPublic<PublicNewsPage>(`/public/news?limit=${limit}`, locale)
    .then((page) => page.items)
    .catch((): PublicNewsItem[] => []);
}

export function fetchSiteSetting(locale: Locale) {
  return fetchPublic<PublicSiteSetting>("/public/site-settings", locale).catch(
    () => null,
  );
}
