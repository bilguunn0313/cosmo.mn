import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { NewsCard } from "@/components/site/media/news-card";
import { NewsSlide } from "@/components/site/media/news-slide";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const GRID_COLUMNS: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

interface LatestNewsSectionProps {
  news: PublicNewsItem[];
}

export async function LatestNewsSection({ news }: LatestNewsSectionProps) {
  const t = await getTranslations("home");

  if (news.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="latest-news-title"
      data-flush-footer
      className="bg-white pt-14 pb-16 md:pt-20 md:pb-24"
    >
      <div className="site-container">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3 md:mb-8 md:gap-6">
          <div className="flex flex-col gap-4">
            <h2 id="latest-news-title" className="type-section text-ink">
              {t("newsTitle")}
            </h2>
          </div>
          <Link href="/media" className={siteButtonClass("ghost", "group")}>
            {t("allNews")}
            <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        {news.length === 1 ? (
          <Reveal>
            <NewsSlide news={news[0]} titleTag="h3" />
          </Reveal>
        ) : (
          <ul
            className={cn(
              "grid gap-x-6 gap-y-5 md:gap-y-10",
              GRID_COLUMNS[news.length] ?? GRID_COLUMNS[4],
            )}
          >
            {news.map((item, index) => (
              <li key={item.slug}>
                <Reveal index={index}>
                  <NewsCard news={item} isCompact />
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
