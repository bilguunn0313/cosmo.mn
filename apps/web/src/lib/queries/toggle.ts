import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Paginated } from "@/lib/types";

type ListData<T> = T[] | Paginated<T> | undefined;

function patchList<T extends { id: number }>(
  data: ListData<T>,
  id: number,
  patch: Partial<T>,
): ListData<T> {
  const patchItem = (item: T) =>
    item.id === id ? { ...item, ...patch } : item;

  if (Array.isArray(data)) {
    return data.map(patchItem);
  }

  if (data && "items" in data) {
    return { ...data, items: data.items.map(patchItem) };
  }

  return data;
}

export function useToggle<T extends { id: number }>(
  queryKey: QueryKey,
  basePath: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: Partial<T> }) =>
      api<T>(`${basePath}/${id}`, { method: "PATCH", body: patch }),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueriesData<ListData<T>>({ queryKey });
      queryClient.setQueriesData<ListData<T>>({ queryKey }, (data) =>
        patchList(data, id, patch),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      for (const [key, data] of context?.previous ?? []) {
        queryClient.setQueryData(key, data);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}
