import type { Locale } from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:4000";
const REVALIDATE_SECONDS = 60;

export async function fetchPublic<T>(path: string, locale: Locale): Promise<T> {
  const url = new URL(path, API_URL);
  url.searchParams.set("locale", locale);

  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
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

export function fetchSiteSetting(locale: Locale) {
  return fetchPublic<PublicSiteSetting>("/public/site-settings", locale).catch(
    () => null,
  );
}
