import type { BrandCategory, CountryCode, SectionPage } from "@cosmo/shared";
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
  salesPointCount: number | null;
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
  showcaseImageUrl: string | null;
  originCountry: CountryCode | null;
}

export function fetchBrands(locale: Locale) {
  return fetchPublic<PublicBrand[]>("/public/brands", locale).catch(
    (): PublicBrand[] => [],
  );
}

export interface PublicSection {
  id: number;
  title: string;
  body: string;
  imageUrl: string | null;
}

export function fetchSections(page: SectionPage, locale: Locale) {
  return fetchPublic<PublicSection[]>(
    `/public/sections?page=${page}`,
    locale,
  ).catch((): PublicSection[] => []);
}

export interface PublicProduct {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string;
}

export interface PublicMilestone {
  id: number;
  year: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
}

export function fetchMilestones(locale: Locale) {
  return fetchPublic<PublicMilestone[]>("/public/milestones", locale).catch(
    (): PublicMilestone[] => [],
  );
}

export interface PublicBrandDetail extends PublicBrand {
  websiteUrl: string | null;
  sections: PublicSection[];
  products: PublicProduct[];
}

export function fetchBrand(slug: string, locale: Locale) {
  return fetchPublic<PublicBrandDetail>(
    `/public/brands/${encodeURIComponent(slug)}`,
    locale,
  ).catch(() => null);
}

export interface PublicNewsItem {
  slug: string;
  title: string;
  summary: string | null;
  coverUrl: string | null;
  videoUrl: string | null;
  publishedAt: string;
}

export interface PublicNewsPage {
  items: PublicNewsItem[];
  total: number;
}

export function fetchNewsPage(locale: Locale, page: number, limit: number) {
  return fetchPublic<PublicNewsPage>(
    `/public/news?page=${page}&limit=${limit}`,
    locale,
  ).catch((): PublicNewsPage => ({ items: [], total: 0 }));
}

export function fetchLatestNews(locale: Locale, limit: number) {
  return fetchNewsPage(locale, 1, limit).then((page) => page.items);
}

export interface PublicNewsDetail extends PublicNewsItem {
  content: string;
}

export function fetchNews(slug: string, locale: Locale) {
  return fetchPublic<PublicNewsDetail>(
    `/public/news/${encodeURIComponent(slug)}`,
    locale,
  ).catch(() => null);
}

export interface PublicDepartment {
  id: number;
  name: string;
}

export function fetchDepartments(locale: Locale) {
  return fetchPublic<PublicDepartment[]>(
    "/public/contact/departments",
    locale,
  ).catch((): PublicDepartment[] => []);
}

export function fetchSiteSetting(locale: Locale) {
  return fetchPublic<PublicSiteSetting>("/public/site-settings", locale).catch(
    () => null,
  );
}
