import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ImageFrame } from "@/lib/image-frame";
import type { Media, MediaType, MediaUsage, Paginated } from "@/lib/types";

const PAGE_SIZE = 24;

export const mediaQueryKey = ["media"];

export function useMediaLibrary(type: MediaType | undefined) {
  return useInfiniteQuery({
    queryKey: [...mediaQueryKey, "list", type ?? "ALL"],
    queryFn: ({ pageParam }) =>
      api<Paginated<Media>>("/admin/media", {
        searchParams: { type, page: pageParam, limit: PAGE_SIZE },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.page * lastPage.limit;
      return loaded < lastPage.total ? lastPage.page + 1 : undefined;
    },
  });
}

export function useMediaUsages(id: number | null) {
  return useQuery({
    queryKey: [...mediaQueryKey, "usages", id],
    queryFn: () => api<MediaUsage[]>(`/admin/media/${id}/usages`),
    enabled: id !== null,
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api<void>(`/admin/media/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mediaQueryKey }),
  });
}

export function useUpdateMediaFrame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, frame }: { id: number; frame: ImageFrame }) =>
      api<Media>(`/admin/media/${id}`, { method: "PATCH", body: frame }),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useInvalidateMedia() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: mediaQueryKey });
}
