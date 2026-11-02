import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  brand: "text-brand",
  white: "text-white",
} as const;

interface SectionEyebrowProps {
  tone?: keyof typeof TONE_CLASSES;
  className?: string;
  children: React.ReactNode;
}

export function SectionEyebrow({
  tone = "brand",
  className,
  children,
}: SectionEyebrowProps) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-3.5 font-display text-[13px] leading-[1.3] font-semibold tracking-[0.16em] uppercase",
        TONE_CLASSES[tone],
        className,
      )}
    >
      <span
        aria-hidden
        className="h-[3px] w-7 shrink-0 rounded-full bg-current"
      />
      {children}
    </p>
  );
}
