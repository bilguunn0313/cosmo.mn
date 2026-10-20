import { getTranslations } from "next-intl/server";
import { NewsCard } from "@/components/site/media/news-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import type { PublicNewsItem } from "@/lib/public-api";

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
      className="site-container pt-20 md:pt-32"
    >
      <SectionHeader
        id="latest-news-title"
        title={t("newsTitle")}
        link={{ href: "/media", label: t("allNews") }}
      />

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {news.map((item, index) => (
          <li key={item.slug}>
            <Reveal index={index} className="h-full">
              <NewsCard news={item} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
