import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { brandPath, newsPath } from "@/lib/site-links";
import { pickDefaultTranslation } from "@/lib/translations";
import type { Locale, Paginated } from "@/lib/types";

interface BrandTarget {
  slug: string;
  isPublished: boolean;
  translations: { locale: Locale; name: string }[];
}

interface NewsTarget {
  slug: string;
  isPublished: boolean;
  translations: { locale: Locale; title: string }[];
}

export interface LinkTarget {
  path: string;
  label: string;
  isPublished: boolean;
}

const RECENT_NEWS_LIMIT = 30;

async function fetchLinkTargets() {
  const [brands, news] = await Promise.all([
    api<BrandTarget[]>("/admin/brands"),
    api<Paginated<NewsTarget>>("/admin/news", {
      searchParams: { limit: RECENT_NEWS_LIMIT },
    }),
  ]);

  return {
    brands: brands.map((brand) => ({
      path: brandPath(brand.slug),
      label: pickDefaultTranslation(brand.translations)?.name ?? brand.slug,
      isPublished: brand.isPublished,
    })),
    news: news.items.map((item) => ({
      path: newsPath(item.slug),
      label: pickDefaultTranslation(item.translations)?.title ?? item.slug,
      isPublished: item.isPublished,
    })),
  };
}

export function useLinkTargets() {
  return useQuery({
    queryKey: ["link-targets"],
    queryFn: fetchLinkTargets,
  });
}
