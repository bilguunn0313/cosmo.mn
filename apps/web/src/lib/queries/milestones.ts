import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateMilestoneInput } from "@cosmo/shared";
import { api } from "@/lib/api";
import type { Milestone } from "@/lib/types";
import { useToggle } from "./toggle";

const milestonesPath = "/admin/milestones";
const milestonesQueryKey = ["milestones"];

export function useMilestones() {
  return useQuery({
    queryKey: milestonesQueryKey,
    queryFn: () => api<Milestone[]>(milestonesPath),
  });
}

export function useSaveMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id?: number;
      input: CreateMilestoneInput;
    }) =>
      id
        ? api<Milestone>(`${milestonesPath}/${id}`, {
            method: "PATCH",
            body: input,
          })
        : api<Milestone>(milestonesPath, { method: "POST", body: input }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: milestonesQueryKey }),
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api<void>(`${milestonesPath}/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: milestonesQueryKey }),
  });
}

export function useToggleMilestone() {
  return useToggle<Milestone>(milestonesQueryKey, milestonesPath);
}
