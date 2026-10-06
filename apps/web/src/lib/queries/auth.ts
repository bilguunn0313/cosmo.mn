import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginInput } from "@cosmo/shared";
import { api } from "@/lib/api";
import type { AuthAdmin } from "@/lib/types";

export const meQueryKey = ["auth", "me"];

export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: () => api<AuthAdmin>("/auth/me"),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) =>
      api<AuthAdmin>("/auth/login", { method: "POST", body: input }),
    onSuccess: (admin) => {
      queryClient.setQueryData(meQueryKey, admin);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api<void>("/auth/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
