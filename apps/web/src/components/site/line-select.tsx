import { ChevronDown } from "lucide-react";
import { inputClass } from "@/components/site/form-styles";
import { cn } from "@/lib/utils";

export function LineSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          inputClass,
          "h-11 cursor-pointer appearance-none pr-8",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 size-4.5 -translate-y-1/2 text-ink-2"
      />
    </div>
  );
}
