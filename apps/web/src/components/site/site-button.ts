import { cn } from "@/lib/utils";

const BASE_CLASS =
  "inline-flex h-13 items-center justify-between gap-6 rounded-control px-5 text-sm font-semibold transition-[background-color,color] duration-150 ease-out";

const VARIANT_CLASSES = {
  primary: "bg-brand text-white hover:bg-brand-600",
  secondary: "border border-ink-3 text-ink hover:bg-ink/7 active:bg-ink/14",
  white: "bg-white text-brand-700 hover:bg-brand-100",
  ghost: "h-auto gap-2 px-1 py-2 text-brand-700 hover:bg-brand-100",
} as const;

export type SiteButtonVariant = keyof typeof VARIANT_CLASSES;

export function siteButtonClass(
  variant: SiteButtonVariant,
  className?: string,
) {
  return cn(BASE_CLASS, VARIANT_CLASSES[variant], className);
}
