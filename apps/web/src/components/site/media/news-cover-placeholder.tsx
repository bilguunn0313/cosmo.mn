import { Wordmark } from "@/components/site/wordmark";

export function NewsCoverPlaceholder() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 grid place-items-center bg-brand-night"
    >
      <Wordmark className="text-[clamp(40px,6vw,88px)] text-white/15" />
    </div>
  );
}
