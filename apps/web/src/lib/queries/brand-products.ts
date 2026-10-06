import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateProductInput, UpdateProductInput } from "@cosmo/shared";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { useReorder } from "./reorder";

function productsPath(brandId: number) {
  return `/admin/brands/${brandId}/products`;
}

export function productsQueryKey(brandId: number) {
  return ["brand-products", brandId];
}

export function useProducts(brandId: number) {
  return useQuery({
    queryKey: productsQueryKey(brandId),
    queryFn: () => api<Product[]>(productsPath(brandId)),
  });
}

export function useSaveProduct(brandId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: CreateProductInput }) =>
      id
        ? api<Product>(`${productsPath(brandId)}/${id}`, {
            method: "PATCH",
            body: input,
          })
        : api<Product>(productsPath(brandId), { method: "POST", body: input }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productsQueryKey(brandId) }),
  });
}

export function useUpdateProduct(brandId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateProductInput }) =>
      api<Product>(`${productsPath(brandId)}/${id}`, {
        method: "PATCH",
        body: input,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productsQueryKey(brandId) }),
  });
}

export function useDeleteProduct(brandId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api<void>(`${productsPath(brandId)}/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productsQueryKey(brandId) }),
  });
}

export function useReorderProducts(brandId: number) {
  return useReorder<Product>(
    productsQueryKey(brandId),
    `${productsPath(brandId)}/reorder`,
  );
}
