import { Play } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import { NewsDate } from "./news-date";

async function VideoBadge() {
  const t = await getTranslations("home");

  return (
    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md">
      <Play className="size-3.5 fill-current" />
      {t("video")}
    </span>
  );
}

interface NewsCardProps {
  news: PublicNewsItem;
  isFeatured?: boolean;
}

export function NewsCard({ news, isFeatured = false }: NewsCardProps) {
  return (
    <Link
      href={newsPath(news.slug)}
      className={cn(
        "group grid h-full overflow-hidden rounded-3xl bg-card outline-offset-4 outline-primary transition-[scale] duration-150 ease-(--ease-out) focus-visible:outline-2 motion-safe:active:scale-[0.99] md:rounded-[2rem]",
        isFeatured && "lg:grid-cols-[1.4fr_1fr]",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {news.coverUrl ? (
          <Image
            src={news.coverUrl}
            alt=""
            fill
            unoptimized
            sizes={
              isFeatured
                ? "(min-width: 1024px) 60vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            }
            className="object-cover transition-[scale] duration-700 ease-(--ease-out) group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        ) : (
          <div className="bg-brand-gradient absolute inset-0" />
        )}
        {news.videoUrl && <VideoBadge />}
      </div>

      <div
        className={cn(
          "grid content-start gap-3 p-5 md:p-7",
          isFeatured && "lg:content-center lg:gap-4 lg:p-12",
        )}
      >
        <NewsDate publishedAt={news.publishedAt} />
        <h2
          className={cn(
            "leading-[1.2] font-semibold tracking-tight text-balance transition-colors duration-150 group-hover:text-primary",
            isFeatured
              ? "text-2xl md:text-4xl"
              : "line-clamp-3 text-xl md:text-2xl",
          )}
        >
          {news.title}
        </h2>
        {news.summary && (
          <p
            className={cn(
              "text-muted-foreground",
              isFeatured ? "line-clamp-4 md:text-lg" : "line-clamp-2",
            )}
          >
            {news.summary}
          </p>
        )}
      </div>
    </Link>
  );
}
