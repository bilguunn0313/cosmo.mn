import { FadeInImage } from "@/components/site/fade-in-image";
import type { PublicNewsItem } from "@/lib/public-api";
import { cn } from "@/lib/utils";
import { NewsCoverPlaceholder } from "./news-cover-placeholder";
import { VideoBadge } from "./video-badge";

interface NewsCoverProps {
  news: PublicNewsItem;
  sizes: string;
  priority?: boolean;
  isCompact?: boolean;
  className?: string;
}

export function NewsCover({
  news,
  sizes,
  priority = false,
  isCompact = false,
  className,
}: NewsCoverProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-ink)_8%,transparent)]",
        className,
      )}
    >
      {news.coverUrl ? (
        <div className="absolute inset-0 transition-[scale] duration-250 ease-out group-hover:scale-[1.04] group-hover:duration-500 motion-reduce:transition-none">
          <FadeInImage
            src={news.coverUrl}
            alt=""
            fill
            unoptimized
            priority={priority}
            sizes={sizes}
            className="object-cover"
          />
        </div>
      ) : (
        <NewsCoverPlaceholder />
      )}
      {news.videoUrl && <VideoBadge isCompact={isCompact} />}
    </div>
  );
}
