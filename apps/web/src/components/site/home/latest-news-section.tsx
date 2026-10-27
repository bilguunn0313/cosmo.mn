import { getTranslations } from "next-intl/server";
import { NewsCard } from "@/components/site/media/news-card";
import type { PublicNewsItem } from "@/lib/public-api";
import { NewsRail } from "./news-rail";

interface LatestNewsSectionProps {
  news: PublicNewsItem[];
}

export async function LatestNewsSection({ news }: LatestNewsSectionProps) {
  const t = await getTranslations("home");

  if (news.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="latest-news-title" className="pt-20 md:pt-32">
      <NewsRail
        titleId="latest-news-title"
        title={t("newsTitle")}
        labels={{
          previous: t("previous"),
          next: t("next"),
          allNews: t("allNews"),
        }}
      >
        {news.map((item) => (
          <li key={item.slug} className="snap-start">
            <NewsCard news={item} />
          </li>
        ))}
      </NewsRail>
    </section>
  );
}
