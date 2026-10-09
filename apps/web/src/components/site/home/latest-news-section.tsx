import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import Image from "next/image";
import { ImageReveal } from "@/components/site/image-reveal";
import { Reveal } from "@/components/site/reveal";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";

const DATE_FORMAT = {
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

interface NewsDateProps {
  publishedAt: string;
}

async function NewsDate({ publishedAt }: NewsDateProps) {
  const format = await getFormatter();

  return (
    <time
      dateTime={publishedAt}
      className="text-sm text-muted-foreground tabular-nums"
    >
      {format.dateTime(new Date(publishedAt), DATE_FORMAT)}
    </time>
  );
}

interface FeaturedNewsProps {
  news: PublicNewsItem;
}

async function FeaturedNews({ news }: FeaturedNewsProps) {
  const t = await getTranslations("home");

  return (
    <Link
      href={newsPath(news.slug)}
      className="group grid content-start gap-6 rounded-3xl outline-offset-4 outline-primary focus-visible:outline-2 md:rounded-[2rem]"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-muted transition-[scale] duration-150 ease-(--ease-out) motion-safe:group-active:scale-[0.99] md:rounded-[2rem]">
        <ImageReveal>
          {news.coverUrl ? (
            <Image
              src={news.coverUrl}
              alt=""
              fill
              unoptimized
              loading="eager"
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover transition-[scale] duration-700 ease-(--ease-out) group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          ) : (
            <div className="bg-brand-gradient absolute inset-0" />
          )}
        </ImageReveal>
        {news.videoUrl && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md sm:top-6 sm:left-6">
            <Play className="size-3.5 fill-current" />
            {t("video")}
          </span>
        )}
      </div>

      <Reveal delay={0.35} className="grid max-w-2xl gap-3">
        <NewsDate publishedAt={news.publishedAt} />
        <h3 className="text-2xl leading-[1.15] font-semibold tracking-tight text-balance transition-colors duration-150 group-hover:text-primary md:text-4xl">
          {news.title}
        </h3>
        {news.summary && (
          <p className="line-clamp-2 text-base text-muted-foreground md:text-lg">
            {news.summary}
          </p>
        )}
      </Reveal>
    </Link>
  );
}

interface NewsRowProps {
  news: PublicNewsItem;
}

async function NewsRow({ news }: NewsRowProps) {
  const t = await getTranslations("home");

  return (
    <Link
      href={newsPath(news.slug)}
      className="group flex items-start justify-between gap-6 py-6 outline-offset-4 outline-primary focus-visible:outline-2 md:py-8"
    >
      <div className="grid gap-2">
        <div className="flex items-center gap-3">
          <NewsDate publishedAt={news.publishedAt} />
          {news.videoUrl && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              <Play className="size-3 fill-current" />
              {t("video")}
            </span>
          )}
        </div>
        <h3 className="line-clamp-2 text-xl leading-snug font-semibold tracking-tight transition-colors duration-150 group-hover:text-primary md:text-2xl">
          {news.title}
        </h3>
      </div>
      <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-[color,translate] duration-200 ease-(--ease-out) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
    </Link>
  );
}

interface LatestNewsSectionProps {
  news: PublicNewsItem[];
}

export async function LatestNewsSection({ news }: LatestNewsSectionProps) {
  const t = await getTranslations("home");
  const [featured, ...rest] = news;

  if (!featured) {
    return null;
  }

  return (
    <section
      aria-labelledby="latest-news-title"
      className="site-container-wide grid gap-8 py-10 md:gap-10 md:py-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2
          id="latest-news-title"
          className="text-3xl leading-[1.1] font-semibold tracking-tight text-balance md:text-5xl"
        >
          {t("newsTitle")}
        </h2>
        <Link
          href="/media"
          className="group inline-flex items-center gap-2 text-[15px] font-medium text-primary"
        >
          {t("allNews")}
          <ArrowRight className="size-4 transition-[translate] duration-200 ease-(--ease-out) group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div
        className={cn(
          "grid gap-10",
          rest.length > 0 && "lg:grid-cols-[1.4fr_1fr] lg:gap-16",
        )}
      >
        <FeaturedNews news={featured} />

        {rest.length > 0 && (
          <ul className="divide-y border-y lg:self-start">
            {rest.map((item, index) => (
              <li key={item.slug}>
                <Reveal index={index}>
                  <NewsRow news={item} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
