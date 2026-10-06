import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateSectionInput } from "@cosmo/shared";
import { api } from "@/lib/api";
import type { Section, SectionPage } from "@/lib/types";
import { useReorder } from "./reorder";

export type SectionsSource = { page: SectionPage } | { brandId: number };

function basePath(source: SectionsSource) {
  return "brandId" in source
    ? `/admin/brands/${source.brandId}/sections`
    : "/admin/sections";
}

export function sectionsQueryKey(source: SectionsSource) {
  return "brandId" in source
    ? ["brand-sections", source.brandId]
    : ["sections", source.page];
}

export function useSections(source: SectionsSource) {
  return useQuery({
    queryKey: sectionsQueryKey(source),
    queryFn: () =>
      api<Section[]>(basePath(source), {
        searchParams: "page" in source ? { page: source.page } : undefined,
      }),
  });
}

export function useSaveSection(source: SectionsSource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: UpdateSectionInput }) => {
      if (id) {
        return api<Section>(`${basePath(source)}/${id}`, {
          method: "PATCH",
          body: input,
        });
      }

      const body = "page" in source ? { ...input, page: source.page } : input;
      return api<Section>(basePath(source), { method: "POST", body });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: sectionsQueryKey(source) }),
  });
}

export function useDeleteSection(source: SectionsSource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api<void>(`${basePath(source)}/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: sectionsQueryKey(source) }),
  });
}

export function useReorderSections(source: SectionsSource) {
  return useReorder<Section>(
    sectionsQueryKey(source),
    `${basePath(source)}/reorder`,
  );
}
