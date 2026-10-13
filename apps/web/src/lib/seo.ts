import { DEFAULT_LOCALE, LOCALES } from "@cosmo/shared";
import type { Metadata } from "next";
import type { Locale } from "./types";

export const SITE_URL = process.env.SITE_URL ?? "https://cosmo.mn";
export const SITE_NAME = "Cosmo Trade";

const SITE_NAMES: Record<Locale, string> = {
  mn: "Космо Трейд",
  en: SITE_NAME,
  zh: SITE_NAME,
};

export function siteNameFor(locale: Locale) {
  return SITE_NAMES[locale];
}

const DEFAULT_SHARE_IMAGE = "/og-image.png";
const DESCRIPTION_MAX_LENGTH = 160;

const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  mn: "mn_MN",
  en: "en_US",
  zh: "zh_CN",
};

export function localizedPath(locale: Locale, path: string) {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function shortenDescription(text: string) {
  if (text.length <= DESCRIPTION_MAX_LENGTH) {
    return text;
  }

  const cut = text.slice(0, DESCRIPTION_MAX_LENGTH - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

interface PageMetadataOptions {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string | null;
  isHome?: boolean;
  publishedTime?: string;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  isHome = false,
  publishedTime,
}: PageMetadataOptions): Metadata {
  const siteName = siteNameFor(locale);
  const fullTitle = isHome ? title : `${title} | ${siteName}`;
  const shortDescription = shortenDescription(description);
  const images = [image ?? DEFAULT_SHARE_IMAGE];
  const url = localizedPath(locale, path);

  const openGraphBase = {
    siteName,
    locale: OPEN_GRAPH_LOCALES[locale],
    url,
    title: fullTitle,
    description: shortDescription,
    images,
  };

  return {
    title: isHome ? { absolute: title } : title,
    description: shortDescription,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          LOCALES.map((other) => [other, localizedPath(other, path)]),
        ),
        "x-default": localizedPath(DEFAULT_LOCALE, path),
      },
    },
    openGraph: publishedTime
      ? { ...openGraphBase, type: "article", publishedTime }
      : { ...openGraphBase, type: "website" },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: shortDescription,
      images,
    },
  };
}
