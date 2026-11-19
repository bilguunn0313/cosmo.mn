import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { NewsCover } from "./news-cover";
import { NewsMeta } from "./news-meta";

interface NewsCardProps {
  news: PublicNewsItem;
}

export async function NewsCard({ news }: NewsCardProps) {
  const t = await getTranslations("home");

  return (
    <Link
      href={newsPath(news.slug)}
      className="group flex h-full flex-col rounded-card outline-offset-4 outline-brand transition-[scale] duration-160 ease-out focus-visible:outline-2 active:scale-[0.98] motion-reduce:transition-none"
    >
      <NewsCover
        news={news}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-3/2 rounded-card"
      />

      <NewsMeta news={news} className="mt-5" />
      <h3 className="mt-2 mb-5 line-clamp-3 type-h4 font-semibold text-balance text-ink transition-colors duration-150 group-hover:text-brand-700">
        {news.title}
      </h3>

      <span className="mt-auto flex items-center gap-1.5 border-t border-rule pt-4 text-sm font-semibold text-brand-700">
        {t("learnMore")}
        <ArrowUpRight className="size-4 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
