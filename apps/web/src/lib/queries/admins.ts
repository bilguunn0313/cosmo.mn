import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateAdminInput } from "@cosmo/shared";
import { api } from "@/lib/api";
import type { Admin } from "@/lib/types";

const adminsQueryKey = ["admins"];

export function useAdmins() {
  return useQuery({
    queryKey: adminsQueryKey,
    queryFn: () => api<Admin[]>("/admin/admins"),
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAdminInput) =>
      api<Admin>("/admin/admins", { method: "POST", body: input }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminsQueryKey }),
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api<void>(`/admin/admins/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminsQueryKey }),
  });
}
