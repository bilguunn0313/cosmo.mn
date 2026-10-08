import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { CreateNewsInput, UpdateNewsInput } from "@cosmo/shared";
import { api } from "@/lib/api";
import type { News, Paginated } from "@/lib/types";
import { useToggle } from "./toggle";

export const NEWS_PAGE_SIZE = 12;

const newsListQueryKey = ["news", "list"];

export function useNewsList(page: number) {
  return useQuery({
    queryKey: [...newsListQueryKey, page],
    queryFn: () =>
      api<Paginated<News>>("/admin/news", {
        searchParams: { page, limit: NEWS_PAGE_SIZE },
      }),
    placeholderData: keepPreviousData,
  });
}

export function useNews(id: number) {
  return useQuery({
    queryKey: ["news", id],
    queryFn: () => api<News>(`/admin/news/${id}`),
  });
}

function useInvalidateNews() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["news"] }),
      queryClient.invalidateQueries({ queryKey: ["link-targets"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    ]);
}

export function useCreateNews() {
  const invalidateNews = useInvalidateNews();

  return useMutation({
    mutationFn: (input: CreateNewsInput) =>
      api<News>("/admin/news", { method: "POST", body: input }),
    onSuccess: invalidateNews,
  });
}

export function useUpdateNews() {
  const invalidateNews = useInvalidateNews();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateNewsInput }) =>
      api<News>(`/admin/news/${id}`, { method: "PATCH", body: input }),
    onSuccess: invalidateNews,
  });
}

export function useDeleteNews() {
  const invalidateNews = useInvalidateNews();

  return useMutation({
    mutationFn: (id: number) =>
      api<void>(`/admin/news/${id}`, { method: "DELETE" }),
    onSuccess: invalidateNews,
  });
}

export function useToggleNews() {
  return useToggle<News>(newsListQueryKey, "/admin/news");
}
