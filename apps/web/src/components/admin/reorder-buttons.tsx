import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReorderButtonsProps {
  isFirst: boolean;
  isLast: boolean;
  disabled?: boolean;
  onMove: (direction: -1 | 1) => void;
}

export function ReorderButtons({
  isFirst,
  isLast,
  disabled = false,
  onMove,
}: ReorderButtonsProps) {
  return (
    <div className="flex flex-col">
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Дээш зөөх"
        disabled={disabled || isFirst}
        onClick={() => onMove(-1)}
      >
        <ChevronUp />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Доош зөөх"
        disabled={disabled || isLast}
        onClick={() => onMove(1)}
      >
        <ChevronDown />
      </Button>
    </div>
  );
}
