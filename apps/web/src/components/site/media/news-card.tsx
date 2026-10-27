import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { NewsCover } from "./news-cover";
import { NewsMeta } from "./news-meta";

interface NewsCardProps {
  news: PublicNewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link
      href={newsPath(news.slug)}
      className="group grid content-start gap-4 rounded-card outline-offset-4 outline-brand transition-[scale] duration-160 ease-out focus-visible:outline-2 active:scale-[0.98] motion-reduce:transition-none"
    >
      <NewsCover
        news={news}
        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="aspect-16/10 rounded-card"
      />

      <div className="grid gap-2.5 pr-2">
        <NewsMeta news={news} />
        <h3 className="line-clamp-3 type-h4 text-balance transition-colors duration-150 group-hover:text-brand-700">
          {news.title}
        </h3>
        {news.summary && (
          <p className="line-clamp-2 text-sm leading-[1.45] text-pretty text-ink-2">
            {news.summary}
          </p>
        )}
      </div>
    </Link>
  );
}
