import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className }: WordmarkProps) {
  return (
    <span
      className={cn(
        "text-[30px] leading-none font-extrabold tracking-[-0.04em] text-brand",
        className,
      )}
    >
      Cosmo
    </span>
  );
}
