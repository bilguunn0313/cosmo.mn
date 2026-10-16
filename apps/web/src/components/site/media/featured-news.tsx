import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ImageReveal } from "@/components/site/image-reveal";
import { Reveal } from "@/components/site/reveal";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { NewsCoverPlaceholder } from "./news-cover-placeholder";
import { NewsMeta } from "./news-meta";
import { VideoBadge } from "./video-badge";

interface FeaturedNewsProps {
  news: PublicNewsItem;
}

export async function FeaturedNews({ news }: FeaturedNewsProps) {
  const t = await getTranslations("home");

  return (
    <Link
      href={newsPath(news.slug)}
      className="group grid gap-6 border-b border-rule pb-10 outline-offset-4 outline-brand focus-visible:outline-2 md:pb-14 lg:grid-cols-12 lg:items-end lg:gap-x-6"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-surface lg:col-span-7 lg:aspect-auto lg:h-[min(62vh,560px)]">
        <ImageReveal>
          {news.coverUrl ? (
            <Image
              src={news.coverUrl}
              alt=""
              fill
              unoptimized
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover transition-[scale] duration-800 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          ) : (
            <NewsCoverPlaceholder />
          )}
        </ImageReveal>
        {news.videoUrl && <VideoBadge />}
      </div>

      <Reveal
        delay={0.3}
        className="grid justify-items-start gap-5 lg:col-span-5"
      >
        <NewsMeta news={news} />
        <h2 className="text-[clamp(32px,3.4vw,52px)] leading-[1.02] font-semibold tracking-heading text-balance transition-colors duration-150 group-hover:text-brand-700">
          {news.title}
        </h2>
        {news.summary && (
          <p className="line-clamp-4 text-[17px] leading-normal text-pretty text-ink-2">
            {news.summary}
          </p>
        )}
        <span className="inline-flex items-center gap-2 py-2 text-[15px] font-semibold text-brand-700">
          {t("learnMore")}
          <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
        </span>
      </Reveal>
    </Link>
  );
}
