import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoBadgeProps {
  isCompact?: boolean;
}

export function VideoBadge({ isCompact = false }: VideoBadgeProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute grid place-items-center rounded-control bg-brand text-white",
        isCompact
          ? "bottom-1.5 left-1.5 size-7"
          : "bottom-3 left-3 size-10 md:size-11",
      )}
    >
      <Play
        className={cn("fill-current", isCompact ? "size-3.5" : "size-4.5")}
      />
    </span>
  );
}
