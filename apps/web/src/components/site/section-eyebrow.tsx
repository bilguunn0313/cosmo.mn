import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  coral: "text-coral-700",
  white: "text-white",
} as const;

const SIZE_CLASSES = {
  default: {
    text: "gap-3.5 text-[13px]",
    dash: "w-7",
  },
  large: {
    text: "gap-4 text-base md:text-lg",
    dash: "w-9 md:w-10",
  },
} as const;

interface SectionEyebrowProps {
  as?: "p" | "h2";
  id?: string;
  tone?: keyof typeof TONE_CLASSES;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
  children: React.ReactNode;
}

export function SectionEyebrow({
  as: Tag = "p",
  id,
  tone = "coral",
  size = "default",
  className,
  children,
}: SectionEyebrowProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "inline-flex items-center font-display leading-[1.3] font-semibold tracking-[0.16em] uppercase",
        SIZE_CLASSES[size].text,
        TONE_CLASSES[tone],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-[3px] shrink-0 rounded-full bg-coral",
          SIZE_CLASSES[size].dash,
        )}
      />
      {children}
    </Tag>
  );
}
