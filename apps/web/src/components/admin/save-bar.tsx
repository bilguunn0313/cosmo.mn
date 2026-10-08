import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveBarProps {
  isNew: boolean;
  isDirty: boolean;
  isPending: boolean;
  createLabel: string;
}

export function SaveBar({
  isNew,
  isDirty,
  isPending,
  createLabel,
}: SaveBarProps) {
  return (
    <div className="glass sticky bottom-4 z-10 flex items-center justify-end gap-4 rounded-xl border border-border/60 px-4 py-3 shadow-sm">
      {!isNew && isDirty && (
        <span className="text-sm text-muted-foreground">
          Хадгалаагүй өөрчлөлт байна
        </span>
      )}
      <Button type="submit" disabled={isPending || (!isNew && !isDirty)}>
        {isPending && <Loader2 className="animate-spin" />}
        {isNew ? createLabel : "Хадгалах"}
      </Button>
    </div>
  );
}
