import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateSlideInput, UpdateSlideInput } from "@cosmo/shared";
import { api } from "@/lib/api";
import type { Slide } from "@/lib/types";
import { useReorder } from "./reorder";

export const slidesQueryKey = ["slides"];

export function useSlides() {
  return useQuery({
    queryKey: slidesQueryKey,
    queryFn: () => api<Slide[]>("/admin/slides"),
  });
}

export function useSaveSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: CreateSlideInput }) =>
      id
        ? api<Slide>(`/admin/slides/${id}`, { method: "PATCH", body: input })
        : api<Slide>("/admin/slides", { method: "POST", body: input }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: slidesQueryKey }),
  });
}

export function useUpdateSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateSlideInput }) =>
      api<Slide>(`/admin/slides/${id}`, { method: "PATCH", body: input }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: slidesQueryKey }),
  });
}

export function useDeleteSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api<void>(`/admin/slides/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: slidesQueryKey }),
  });
}

export function useReorderSlides() {
  return useReorder<Slide>(slidesQueryKey, "/admin/slides/reorder");
}
