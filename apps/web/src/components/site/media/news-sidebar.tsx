import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { NewsCover } from "./news-cover";
import { NewsDate } from "./news-date";

interface NewsSidebarProps {
  news: PublicNewsItem[];
}

export async function NewsSidebar({ news }: NewsSidebarProps) {
  const t = await getTranslations("media");

  if (news.length === 0) {
    return null;
  }

  return (
    <aside
      aria-labelledby="news-sidebar-title"
      className="self-start rounded-card bg-surface p-5 md:p-6"
    >
      <h2 id="news-sidebar-title" className="type-h4 font-semibold text-ink">
        {t("moreNews")}
      </h2>

      <ul className="mt-5 grid gap-5">
        {news.map((item) => (
          <li key={item.slug}>
            <Link
              href={newsPath(item.slug)}
              className="group grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-4 rounded-xl outline-offset-4 outline-brand focus-visible:outline-2"
            >
              <NewsCover
                news={item}
                sizes="104px"
                isCompact
                className="aspect-4/3 rounded-xl"
              />
              <span className="grid gap-1.5">
                <span className="line-clamp-3 text-[15px] leading-snug font-medium text-ink transition-colors duration-150 group-hover:text-brand-700">
                  {item.title}
                </span>
                <NewsDate
                  publishedAt={item.publishedAt}
                  variant="short"
                  className="text-[13px] text-ink-3"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
