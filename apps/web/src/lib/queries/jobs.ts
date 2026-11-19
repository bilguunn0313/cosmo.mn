import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateJobPostingInput,
  UpdateJobPostingInput,
} from "@cosmo/shared";
import { api } from "@/lib/api";
import type { JobPosting } from "@/lib/types";
import { useToggle } from "./toggle";

const jobsListQueryKey = ["jobs", "list"];

export function useJobs() {
  return useQuery({
    queryKey: jobsListQueryKey,
    queryFn: () => api<JobPosting[]>("/admin/jobs"),
  });
}

export function useJob(id: number) {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => api<JobPosting>(`/admin/jobs/${id}`),
  });
}

function useInvalidateJobs() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: ["jobs"] });
}

export function useCreateJob() {
  const invalidateJobs = useInvalidateJobs();

  return useMutation({
    mutationFn: (input: CreateJobPostingInput) =>
      api<JobPosting>("/admin/jobs", { method: "POST", body: input }),
    onSuccess: invalidateJobs,
  });
}

export function useUpdateJob() {
  const invalidateJobs = useInvalidateJobs();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateJobPostingInput }) =>
      api<JobPosting>(`/admin/jobs/${id}`, { method: "PATCH", body: input }),
    onSuccess: invalidateJobs,
  });
}

export function useDeleteJob() {
  const invalidateJobs = useInvalidateJobs();

  return useMutation({
    mutationFn: (id: number) =>
      api<void>(`/admin/jobs/${id}`, { method: "DELETE" }),
    onSuccess: invalidateJobs,
  });
}

export function useToggleJob() {
  return useToggle<JobPosting>(jobsListQueryKey, "/admin/jobs");
}
