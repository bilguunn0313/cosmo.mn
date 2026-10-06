import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const target = index + direction;

  if (target < 0 || target >= items.length) {
    return items;
  }

  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function useReorder<T extends { id: number }>(
  queryKey: QueryKey,
  endpoint: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: T[]) =>
      api<void>(endpoint, {
        method: "PATCH",
        body: { ids: items.map((item) => item.id) },
      }),
    onMutate: async (items) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<T[]>(queryKey);
      queryClient.setQueryData(queryKey, items);
      return { previous };
    },
    onError: (_error, _items, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}
