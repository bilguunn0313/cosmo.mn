import { DEFAULT_LOCALE, LOCALES } from "@cosmo/shared";
import type { MetadataRoute } from "next";
import { fetchBrands, fetchNewsPage } from "@/lib/public-api";
import type { PublicNewsItem } from "@/lib/public-api";
import { SITE_URL, localizedPath } from "@/lib/seo";
import { brandPath, newsPath } from "@/lib/site-links";

const STATIC_PATHS = [
  "/",
  "/about",
  "/brands",
  "/human-resources",
  "/media",
  "/contact",
];

const NEWS_BATCH_SIZE = 50;

function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

function sitemapEntries(
  path: string,
  lastModified?: string,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, absoluteUrl(localizedPath(locale, path))]),
  );

  return LOCALES.map((locale) => ({
    url: absoluteUrl(localizedPath(locale, path)),
    lastModified,
    alternates: {
      languages: {
        ...languages,
        "x-default": absoluteUrl(localizedPath(DEFAULT_LOCALE, path)),
      },
    },
  }));
}

async function fetchAllNews() {
  const allNews: PublicNewsItem[] = [];

  for (let page = 1; ; page++) {
    const { items, total } = await fetchNewsPage(
      DEFAULT_LOCALE,
      page,
      NEWS_BATCH_SIZE,
    );
    allNews.push(...items);

    if (items.length === 0 || allNews.length >= total) {
      return allNews;
    }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brands, news] = await Promise.all([
    fetchBrands(DEFAULT_LOCALE),
    fetchAllNews(),
  ]);

  return [
    ...STATIC_PATHS.flatMap((path) => sitemapEntries(path)),
    ...brands.flatMap((brand) => sitemapEntries(brandPath(brand.slug))),
    ...news.flatMap((item) =>
      sitemapEntries(newsPath(item.slug), item.publishedAt),
    ),
  ];
}
