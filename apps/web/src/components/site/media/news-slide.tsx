import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { NewsCover } from "./news-cover";
import { NewsDate } from "./news-date";

interface NewsSlideProps {
  news: PublicNewsItem;
  priority?: boolean;
  titleTag?: "h2" | "h3";
}

export async function NewsSlide({
  news,
  priority = false,
  titleTag = "h2",
}: NewsSlideProps) {
  const t = await getTranslations("home");
  const Title = titleTag;

  return (
    <Link
      href={newsPath(news.slug)}
      className="group grid gap-6 rounded-card outline-offset-4 outline-brand focus-visible:outline-2 lg:grid-cols-12 lg:items-center lg:gap-x-12"
    >
      <NewsCover
        news={news}
        priority={priority}
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="aspect-16/10 rounded-card lg:col-span-7 lg:aspect-4/3"
      />

      <div className="grid justify-items-start gap-4 lg:col-span-5 lg:gap-4.5">
        <p className="flex gap-2.5 text-sm font-medium text-ink-2">
          <NewsDate publishedAt={news.publishedAt} variant="month" />
          {news.videoUrl && (
            <>
              <span aria-hidden>·</span>
              <span className="text-brand-700">{t("video")}</span>
            </>
          )}
        </p>
        <Title className="type-h2 text-balance text-ink transition-colors duration-150 group-hover:text-brand-700 lg:type-display">
          {news.title}
        </Title>
        {news.summary && (
          <p className="line-clamp-4 text-[17px] leading-relaxed text-pretty text-ink-2">
            {news.summary}
          </p>
        )}
        <span className="inline-flex items-center gap-2 py-1 text-[15px] font-semibold text-brand-700">
          {t("learnMore")}
          <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
