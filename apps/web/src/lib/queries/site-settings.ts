import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateSiteSettingInput } from "@cosmo/shared";
import { api } from "@/lib/api";
import type { SiteSetting } from "@/lib/types";

const siteSettingQueryKey = ["site-setting"];

export function useSiteSetting() {
  return useQuery({
    queryKey: siteSettingQueryKey,
    queryFn: () => api<SiteSetting>("/admin/site-settings"),
  });
}

export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateSiteSettingInput) =>
      api<SiteSetting>("/admin/site-settings", { method: "PUT", body: input }),
    onSuccess: (setting) =>
      queryClient.setQueryData(siteSettingQueryKey, setting),
  });
}
