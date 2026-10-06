import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface ToggleItem {
  id: number;
}

interface PaginatedTotal {
  total: number;
}

export interface DashboardStats {
  activeSlides: number;
  totalSlides: number;
  publishedBrands: number;
  totalBrands: number;
  totalNews: number;
  totalMedia: number;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const [slides, brands, news, media] = await Promise.all([
    api<(ToggleItem & { isActive: boolean })[]>("/admin/slides"),
    api<(ToggleItem & { isPublished: boolean })[]>("/admin/brands"),
    api<PaginatedTotal>("/admin/news", { searchParams: { limit: 1 } }),
    api<PaginatedTotal>("/admin/media", { searchParams: { limit: 1 } }),
  ]);

  return {
    activeSlides: slides.filter((slide) => slide.isActive).length,
    totalSlides: slides.length,
    publishedBrands: brands.filter((brand) => brand.isPublished).length,
    totalBrands: brands.length,
    totalNews: news.total,
    totalMedia: media.total,
  };
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
  });
}
