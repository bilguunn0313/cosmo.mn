import { getTranslations } from "next-intl/server";
import type { PublicNewsItem } from "@/lib/public-api";
import { cn } from "@/lib/utils";
import { NewsDate } from "./news-date";

interface NewsMetaProps {
  news: PublicNewsItem;
  className?: string;
}

export async function NewsMeta({ news, className }: NewsMetaProps) {
  const t = await getTranslations("home");

  return (
    <div
      className={cn(
        "flex gap-2.5 text-[13px] font-semibold text-ink-3",
        className,
      )}
    >
      <NewsDate publishedAt={news.publishedAt} />
      <span aria-hidden>·</span>
      {news.videoUrl ? (
        <span className="text-brand-700">{t("video")}</span>
      ) : (
        <span>{t("newsLabel")}</span>
      )}
    </div>
  );
}
