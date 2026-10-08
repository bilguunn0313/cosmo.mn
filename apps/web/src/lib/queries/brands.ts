import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateBrandInput, UpdateBrandInput } from "@cosmo/shared";
import { api } from "@/lib/api";
import type { Brand } from "@/lib/types";
import { useReorder } from "./reorder";
import { useToggle } from "./toggle";

export const brandsQueryKey = ["brands"];

export function brandQueryKey(id: number) {
  return ["brands", id];
}

export function useBrands() {
  return useQuery({
    queryKey: brandsQueryKey,
    queryFn: () => api<Brand[]>("/admin/brands"),
  });
}

export function useBrand(id: number) {
  return useQuery({
    queryKey: brandQueryKey(id),
    queryFn: () => api<Brand>(`/admin/brands/${id}`),
  });
}

function useInvalidateBrands() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: brandsQueryKey }),
      queryClient.invalidateQueries({ queryKey: ["link-targets"] }),
    ]);
}

export function useCreateBrand() {
  const invalidateBrands = useInvalidateBrands();

  return useMutation({
    mutationFn: (input: CreateBrandInput) =>
      api<Brand>("/admin/brands", { method: "POST", body: input }),
    onSuccess: invalidateBrands,
  });
}

export function useUpdateBrand() {
  const invalidateBrands = useInvalidateBrands();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateBrandInput }) =>
      api<Brand>(`/admin/brands/${id}`, { method: "PATCH", body: input }),
    onSuccess: invalidateBrands,
  });
}

export function useDeleteBrand() {
  const invalidateBrands = useInvalidateBrands();

  return useMutation({
    mutationFn: (id: number) =>
      api<void>(`/admin/brands/${id}`, { method: "DELETE" }),
    onSuccess: invalidateBrands,
  });
}

export function useToggleBrand() {
  return useToggle<Brand>(brandsQueryKey, "/admin/brands");
}

export function useReorderBrands() {
  return useReorder<Brand>(brandsQueryKey, "/admin/brands/reorder");
}
