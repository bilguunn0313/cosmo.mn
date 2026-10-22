import { getTranslations } from "next-intl/server";
import { FeaturedNews } from "@/components/site/media/featured-news";
import { NewsCard } from "@/components/site/media/news-card";
import { NewsRow } from "@/components/site/media/news-row";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import type { PublicNewsItem } from "@/lib/public-api";

interface LatestNewsSectionProps {
  news: PublicNewsItem[];
}

export async function LatestNewsSection({ news }: LatestNewsSectionProps) {
  const t = await getTranslations("home");
  const [lead, ...rest] = news;

  if (!lead) {
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

      <div className="mt-6">
        {rest.length === 0 ? (
          <FeaturedNews news={lead} titleAs="h3" />
        ) : (
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <Reveal className="lg:col-span-7">
              <NewsCard news={lead} isLarge />
            </Reveal>

            {rest.length === 1 ? (
              <Reveal index={1} className="lg:col-span-5">
                <NewsCard news={rest[0]} />
              </Reveal>
            ) : (
              <ul className="divide-y divide-rule lg:col-span-5">
                {rest.map((item, index) => (
                  <li key={item.slug} className="py-5 first:pt-0 last:pb-0">
                    <Reveal index={index + 1}>
                      <NewsRow news={item} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
