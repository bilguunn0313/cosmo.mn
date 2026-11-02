import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateRetailPartnerInput } from "@cosmo/shared";
import { api } from "@/lib/api";
import type { RetailPartner } from "@/lib/types";
import { useReorder } from "./reorder";
import { useToggle } from "./toggle";

export const retailPartnersQueryKey = ["retail-partners"];

export function useRetailPartners() {
  return useQuery({
    queryKey: retailPartnersQueryKey,
    queryFn: () => api<RetailPartner[]>("/admin/retail-partners"),
  });
}

export function useSaveRetailPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id?: number;
      input: CreateRetailPartnerInput;
    }) =>
      id
        ? api<RetailPartner>(`/admin/retail-partners/${id}`, {
            method: "PATCH",
            body: input,
          })
        : api<RetailPartner>("/admin/retail-partners", {
            method: "POST",
            body: input,
          }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: retailPartnersQueryKey }),
  });
}

export function useToggleRetailPartner() {
  return useToggle<RetailPartner>(
    retailPartnersQueryKey,
    "/admin/retail-partners",
  );
}

export function useDeleteRetailPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api<void>(`/admin/retail-partners/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: retailPartnersQueryKey }),
  });
}

export function useReorderRetailPartners() {
  return useReorder<RetailPartner>(
    retailPartnersQueryKey,
    "/admin/retail-partners/reorder",
  );
}
