"use client";

import { Pencil, Trash2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { moveItem } from "@/lib/queries/reorder";
import { cn } from "@/lib/utils";
import { ReorderButtons } from "./reorder-buttons";

export interface ContentListItemView {
  thumbnail: React.ReactNode;
  title: string;
  subtitle?: string;
  isVisible: boolean;
}

interface ContentListProps<T extends { id: number }> {
  items: T[] | undefined;
  emptyText: string;
  view: (item: T) => ContentListItemView;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onToggleVisible: (item: T, isVisible: boolean) => void;
  onReorder: (items: T[]) => void;
  reorderable?: boolean;
  visibilityLabels?: { on: string; off: string };
}

const DEFAULT_VISIBILITY_LABELS = { on: "Харагдана", off: "Нуугдсан" };

const ROW_TRANSITION = { duration: 0.2, ease: [0.23, 1, 0.32, 1] } as const;

export function ContentList<T extends { id: number }>({
  items,
  emptyText,
  view,
  onEdit,
  onDelete,
  onToggleVisible,
  onReorder,
  reorderable = true,
  visibilityLabels = DEFAULT_VISIBILITY_LABELS,
}: ContentListProps<T>) {
  const shouldReduceMotion = useReducedMotion();

  if (!items) {
    return (
      <div className="grid gap-2">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
        {emptyText}
      </p>
    );
  }

  return (
    <ul className="grid gap-2">
      {items.map((item, index) => {
        const { thumbnail, title, subtitle, isVisible } = view(item);

        return (
          <motion.li
            key={item.id}
            layout={shouldReduceMotion ? false : "position"}
            transition={ROW_TRANSITION}
            className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-2 pr-3 sm:flex-nowrap"
          >
            {reorderable && (
              <ReorderButtons
                isFirst={index === 0}
                isLast={index === items.length - 1}
                onMove={(direction) =>
                  onReorder(moveItem(items, index, direction))
                }
              />
            )}
            <div className={cn("w-28 shrink-0", !reorderable && "ml-1")}>
              {thumbnail}
            </div>
            <div className="grid min-w-0 flex-1 gap-0.5">
              <span className="truncate font-medium">{title}</span>
              {subtitle && (
                <span className="truncate text-sm text-muted-foreground">
                  {subtitle}
                </span>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Switch
                size="sm"
                checked={isVisible}
                onCheckedChange={(checked) => onToggleVisible(item, checked)}
                aria-label={visibilityLabels.on}
              />
              <span className="w-20">
                {isVisible ? visibilityLabels.on : visibilityLabels.off}
              </span>
            </label>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Засах"
                onClick={() => onEdit(item)}
              >
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Устгах"
                onClick={() => onDelete(item)}
              >
                <Trash2 />
              </Button>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
