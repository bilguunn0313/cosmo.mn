import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import { NewsCover } from "./news-cover";
import { NewsMeta } from "./news-meta";

interface NewsCardProps {
  news: PublicNewsItem;
  isCompact?: boolean;
  priority?: boolean;
}

export function NewsCard({
  news,
  isCompact = false,
  priority = false,
}: NewsCardProps) {
  return (
    <Link
      href={newsPath(news.slug)}
      className={cn(
        "group flex h-full flex-col rounded-card outline-offset-4 outline-brand transition-[scale] duration-160 ease-out focus-visible:outline-2 active:scale-[0.98] motion-reduce:transition-none",
        isCompact && "max-md:flex-row max-md:items-start max-md:gap-3.5",
      )}
    >
      <NewsCover
        news={news}
        priority={priority}
        isCompact={isCompact}
        sizes={
          isCompact
            ? "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 128px"
            : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        }
        className={cn(
          "aspect-3/2 rounded-card",
          isCompact && "max-md:w-32 max-md:shrink-0 max-md:rounded-xl",
        )}
      />

      <div
        className={cn(
          "flex flex-col gap-2",
          isCompact ? "mt-4 max-md:mt-0 max-md:min-w-0 max-md:gap-1.5" : "mt-5",
        )}
      >
        <NewsMeta news={news} className={cn(isCompact && "max-md:text-xs")} />
        <h3
          className={cn(
            "line-clamp-3 font-semibold text-balance text-ink transition-colors duration-150 group-hover:text-brand-700",
            isCompact
              ? "font-display text-lg leading-[1.4] tracking-[-0.01em] max-md:text-[15px]"
              : "type-h4",
          )}
        >
          {news.title}
        </h3>
      </div>
    </Link>
  );
}
