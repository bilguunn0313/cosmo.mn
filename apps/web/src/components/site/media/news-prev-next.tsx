import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import { NewsCover } from "./news-cover";
import { NewsDate } from "./news-date";

interface NeighborLinkProps {
  news: PublicNewsItem;
  label: string;
  isNext: boolean;
  className?: string;
}

function NeighborLink({ news, label, isNext, className }: NeighborLinkProps) {
  const Arrow = isNext ? ArrowRight : ArrowLeft;

  return (
    <Link
      href={newsPath(news.slug)}
      className={cn(
        "group flex items-center gap-5 py-6 outline-offset-4 outline-brand focus-visible:outline-2 md:gap-6 md:py-8",
        isNext && "md:flex-row-reverse md:text-right md:text-last-right",
        className,
      )}
    >
      <NewsCover
        news={news}
        isCompact
        sizes="132px"
        className="aspect-4/3 w-24 flex-none rounded-xl md:w-33"
      />
      <span className="grid min-w-0 gap-2">
        <span
          className={cn(
            "flex items-center gap-2 text-sm font-semibold text-brand-700",
            isNext && "md:justify-end",
          )}
        >
          {!isNext && (
            <Arrow className="size-4 transition-[translate] duration-200 ease-out group-hover:-translate-x-0.5" />
          )}
          {label}
          {isNext && (
            <Arrow className="size-4 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
          )}
        </span>
        <span className="line-clamp-2 font-display text-lg leading-snug font-semibold text-balance text-ink transition-colors duration-150 group-hover:text-brand-700 md:text-xl">
          {news.title}
        </span>
        <NewsDate
          publishedAt={news.publishedAt}
          variant="short"
          className="text-sm text-ink-3"
        />
      </span>
    </Link>
  );
}

interface NewsPrevNextProps {
  previous: PublicNewsItem | null;
  next: PublicNewsItem | null;
}

export async function NewsPrevNext({ previous, next }: NewsPrevNextProps) {
  const t = await getTranslations("media");

  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label={t("newsNavigation")}
      className="site-container pt-20 md:pt-28"
    >
      <div className="mx-auto grid max-w-260 divide-y divide-rule border-y border-rule md:grid-cols-2 md:divide-y-0">
        {previous && (
          <NeighborLink
            news={previous}
            label={t("previousNews")}
            isNext={false}
            className="md:pr-8"
          />
        )}
        {next && (
          <NeighborLink
            news={next}
            label={t("nextNews")}
            isNext
            className={cn(
              "md:col-start-2",
              previous && "md:border-l md:border-rule md:pl-8",
            )}
          />
        )}
      </div>
    </nav>
  );
}
