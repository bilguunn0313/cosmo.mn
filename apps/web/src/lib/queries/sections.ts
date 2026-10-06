import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateSectionInput } from "@cosmo/shared";
import { api } from "@/lib/api";
import type { Section, SectionPage } from "@/lib/types";
import { useReorder } from "./reorder";

export function sectionsQueryKey(page: SectionPage) {
  return ["sections", page];
}

export function useSections(page: SectionPage) {
  return useQuery({
    queryKey: sectionsQueryKey(page),
    queryFn: () =>
      api<Section[]>("/admin/sections", { searchParams: { page } }),
  });
}

export function useSaveSection(page: SectionPage) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: UpdateSectionInput }) =>
      id
        ? api<Section>(`/admin/sections/${id}`, {
            method: "PATCH",
            body: input,
          })
        : api<Section>("/admin/sections", {
            method: "POST",
            body: { ...input, page },
          }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: sectionsQueryKey(page) }),
  });
}

export function useDeleteSection(page: SectionPage) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api<void>(`/admin/sections/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: sectionsQueryKey(page) }),
  });
}

export function useReorderSections(page: SectionPage) {
  return useReorder<Section>(sectionsQueryKey(page), "/admin/sections/reorder");
}
