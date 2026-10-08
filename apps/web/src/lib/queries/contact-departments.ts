import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateContactDepartmentInput } from "@cosmo/shared";
import { api } from "@/lib/api";
import type { ContactDepartment } from "@/lib/types";
import { useReorder } from "./reorder";
import { useToggle } from "./toggle";

const departmentsPath = "/admin/contact-departments";
const departmentsQueryKey = ["contact-departments"];

export function useDepartments() {
  return useQuery({
    queryKey: departmentsQueryKey,
    queryFn: () => api<ContactDepartment[]>(departmentsPath),
  });
}

export function useSaveDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id?: number;
      input: CreateContactDepartmentInput;
    }) =>
      id
        ? api<ContactDepartment>(`${departmentsPath}/${id}`, {
            method: "PATCH",
            body: input,
          })
        : api<ContactDepartment>(departmentsPath, {
            method: "POST",
            body: input,
          }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: departmentsQueryKey }),
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api<void>(`${departmentsPath}/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: departmentsQueryKey }),
  });
}

export function useToggleDepartment() {
  return useToggle<ContactDepartment>(departmentsQueryKey, departmentsPath);
}

export function useReorderDepartments() {
  return useReorder<ContactDepartment>(
    departmentsQueryKey,
    `${departmentsPath}/reorder`,
  );
}
