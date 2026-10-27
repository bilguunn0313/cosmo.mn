import type { SimpleIcon } from "simple-icons";
import { cn } from "@/lib/utils";

interface SocialIconProps {
  icon: SimpleIcon;
  className?: string;
}

export function SocialIcon({ icon, className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("fill-current", className)}
    >
      <path d={icon.path} />
    </svg>
  );
}
