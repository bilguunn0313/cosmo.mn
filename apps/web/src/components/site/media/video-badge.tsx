import { Play } from "lucide-react";

export function VideoBadge() {
  return (
    <span
      aria-hidden
      className="absolute bottom-0 left-0 grid size-12 place-items-center bg-brand text-white md:size-14"
    >
      <Play className="size-4.5 fill-current md:size-5" />
    </span>
  );
}
