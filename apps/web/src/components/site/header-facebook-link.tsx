import { siFacebook } from "simple-icons";
import { cn } from "@/lib/utils";
import { SocialIcon } from "./social-icon";

const TONE_CLASSES = {
  light: "text-ink-2 hover:bg-brand-100 hover:text-brand-700",
  dark: "text-white/85 hover:bg-white/10 hover:text-white",
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
      <SocialIcon icon={siFacebook} className="size-5" />
    </a>
  );
}
