import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className }: WordmarkProps) {
  return (
    <span
      className={cn(
        "text-2xl font-bold tracking-tight text-primary",
        className,
      )}
    >
      Cosmo
    </span>
  );
}
