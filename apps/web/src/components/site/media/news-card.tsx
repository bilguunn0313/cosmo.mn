import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { NewsCoverPlaceholder } from "./news-cover-placeholder";
import { NewsMeta } from "./news-meta";
import { VideoBadge } from "./video-badge";

interface NewsCardProps {
  news: PublicNewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link
      href={newsPath(news.slug)}
      className="group flex h-full flex-col bg-paper transition-colors duration-200 outline-offset-[-2px] hover:bg-brand-100 outline-brand focus-visible:outline-2"
    >
      <div className="relative mx-3 mt-3 aspect-16/10 overflow-hidden rounded-card bg-surface md:mx-4 md:mt-4">
        {news.coverUrl ? (
          <Image
            src={news.coverUrl}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        ) : (
          <NewsCoverPlaceholder />
        )}
        {news.videoUrl && <VideoBadge />}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 md:px-6 md:pt-5 md:pb-7">
        <NewsMeta news={news} />
        <h3 className="line-clamp-3 text-[clamp(21px,1.7vw,26px)] leading-[1.15] font-semibold tracking-heading text-balance transition-colors duration-150 group-hover:text-brand-700">
          {news.title}
        </h3>
        {news.summary && (
          <p className="line-clamp-2 text-[15px] leading-[1.45] text-ink-2">
            {news.summary}
          </p>
        )}
        <ArrowRight className="mt-auto size-5.5 self-end text-brand transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
