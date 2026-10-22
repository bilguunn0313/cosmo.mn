import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ImageReveal } from "@/components/site/image-reveal";
import { Reveal } from "@/components/site/reveal";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { NewsCover } from "./news-cover";
import { NewsMeta } from "./news-meta";

interface FeaturedNewsProps {
  news: PublicNewsItem;
  titleAs?: "h2" | "h3";
  priority?: boolean;
}

export async function FeaturedNews({
  news,
  titleAs: Title = "h2",
  priority = false,
}: FeaturedNewsProps) {
  const t = await getTranslations("home");

  return (
    <Link
      href={newsPath(news.slug)}
      className="group grid gap-6 rounded-card outline-offset-4 outline-brand transition-[scale] duration-160 ease-out focus-visible:outline-2 active:scale-[0.99] motion-reduce:transition-none lg:grid-cols-12 lg:items-center lg:gap-x-10"
    >
      <div className="relative aspect-16/10 overflow-hidden rounded-card bg-surface lg:col-span-7 lg:aspect-auto lg:h-[min(62vh,560px)]">
        <ImageReveal>
          <NewsCover
            news={news}
            priority={priority}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="absolute inset-0 rounded-card"
          />
        </ImageReveal>
      </div>

      <Reveal
        delay={0.3}
        className="grid justify-items-start gap-5 lg:col-span-5"
      >
        <NewsMeta news={news} />
        <Title className="type-h3 text-balance transition-colors duration-150 group-hover:text-brand-700">
          {news.title}
        </Title>
        {news.summary && (
          <p className="line-clamp-4 text-base leading-relaxed text-pretty text-ink-2">
            {news.summary}
          </p>
        )}
        <span className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-brand-700">
          {t("learnMore")}
          <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
        </span>
      </Reveal>
    </Link>
  );
}
