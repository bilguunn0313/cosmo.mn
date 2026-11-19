import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { NewsCard } from "./news-card";

interface MoreNewsSectionProps {
  news: PublicNewsItem[];
}

export async function MoreNewsSection({ news }: MoreNewsSectionProps) {
  const t = await getTranslations();

  if (news.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="more-news-title"
      className="mt-20 bg-surface py-16 md:mt-28 md:py-24"
    >
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="more-news-title" className="type-h2 text-ink">
            {t("media.moreNews")}
          </h2>
          <Link href="/media" className={siteButtonClass("ghost", "group")}>
            {t("home.allNews")}
            <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-10 lg:grid-cols-3">
          {news.map((item, index) => (
            <li key={item.slug}>
              <Reveal index={index} className="h-full">
                <NewsCard news={item} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
