import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { NewsCover } from "./news-cover";
import { NewsMeta } from "./news-meta";

interface NewsRowProps {
  news: PublicNewsItem;
}

export function NewsRow({ news }: NewsRowProps) {
  return (
    <Link
      href={newsPath(news.slug)}
      className="group grid grid-cols-[112px_minmax(0,1fr)] items-start gap-4 rounded-[12px] outline-offset-4 outline-brand transition-[scale] duration-160 ease-out focus-visible:outline-2 active:scale-[0.98] motion-reduce:transition-none md:grid-cols-[148px_minmax(0,1fr)] md:gap-5"
    >
      <NewsCover
        news={news}
        sizes="148px"
        isCompact
        className="aspect-4/3 rounded-[12px]"
      />

      <div className="grid gap-2">
        <NewsMeta news={news} />
        <h3 className="line-clamp-2 text-lg leading-[1.3] font-semibold tracking-[-0.015em] text-balance transition-colors duration-150 group-hover:text-brand-700">
          {news.title}
        </h3>
      </div>
    </Link>
  );
}
