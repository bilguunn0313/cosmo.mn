import { siFacebook } from "simple-icons";
import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  light: "hover:bg-brand-100",
  dark: "hover:bg-white/10",
} as const;

interface HeaderFacebookLinkProps {
  url: string;
  tone?: keyof typeof TONE_CLASSES;
}

export function HeaderFacebookLink({
  url,
  tone = "light",
}: HeaderFacebookLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook"
      className={cn(
        "grid size-10 place-items-center rounded-control transition-colors duration-150",
        TONE_CLASSES[tone],
      )}
    >
      <svg viewBox="0 0 24 24" aria-hidden className="size-6">
        <circle cx="12" cy="12" r="11.8" className="fill-white" />
        <path d={siFacebook.path} fill={`#${siFacebook.hex}`} />
      </svg>
    </a>
  );
}
