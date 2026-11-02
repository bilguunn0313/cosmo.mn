import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { NewsCard } from "@/components/site/media/news-card";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { siteButtonClass } from "@/components/site/site-button";
import { Link } from "@/i18n/navigation";
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
      className="bg-white py-20 md:py-28"
    >
      <div className="site-container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <SectionEyebrow>{t("newsEyebrow")}</SectionEyebrow>
            <h2 id="latest-news-title" className="type-section text-ink">
              {t("newsTitle")}
            </h2>
          </div>
          <Link href="/media" className={siteButtonClass("ghost", "group")}>
            {t("allNews")}
            <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="grid gap-x-6 gap-y-10 md:grid-cols-3">
          {news.map((item) => (
            <li key={item.slug}>
              <NewsCard news={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
