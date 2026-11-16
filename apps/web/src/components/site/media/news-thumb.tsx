import type { PublicNewsItem } from "@/lib/public-api";
import { NewsCover } from "./news-cover";
import { NewsDate } from "./news-date";

interface NewsThumbProps {
  news: PublicNewsItem;
  priority?: boolean;
}

export function NewsThumb({ news, priority = false }: NewsThumbProps) {
  return (
    <>
      <NewsCover
        news={news}
        priority={priority}
        isCompact
        sizes="220px"
        className="aspect-16/10 rounded-xl opacity-75 saturate-60 transition-[opacity,filter] duration-200 ease-out group-hover/thumb:opacity-100 group-hover/thumb:saturate-100 group-aria-pressed/thumb:opacity-100 group-aria-pressed/thumb:saturate-100 group-aria-pressed/thumb:after:shadow-[inset_0_0_0_3px_var(--color-brand)]"
      />
      <NewsDate
        publishedAt={news.publishedAt}
        variant="month"
        className="text-[13px] text-ink-3"
      />
      <span className="line-clamp-2 text-sm leading-snug font-semibold text-ink">
        {news.title}
      </span>
    </>
  );
}
