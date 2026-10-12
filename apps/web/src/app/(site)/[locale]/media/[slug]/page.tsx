import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/site/media/news-card";
import { NewsDate } from "@/components/site/media/news-date";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { fetchLatestNews, fetchNews } from "@/lib/public-api";

const MAX_RELATED = 3;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/media/[slug]">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const { slug } = await params;
  const news = await fetchNews(slug, locale);

  if (!news) {
    return {};
  }

  return {
    title: news.title,
    description: news.summary ?? undefined,
  };
}

export default async function NewsPage({
  params,
}: PageProps<"/[locale]/media/[slug]">) {
  const locale = await getPageLocale(params);
  const { slug } = await params;
  const t = await getTranslations();
  const [news, latest] = await Promise.all([
    fetchNews(slug, locale),
    fetchLatestNews(locale, MAX_RELATED + 1),
  ]);

  if (!news) {
    notFound();
  }

  const related = latest
    .filter((item) => item.slug !== news.slug)
    .slice(0, MAX_RELATED);

  return (
    <div className="site-container-wide grid gap-4 pt-4 md:gap-6 md:pt-6">
      <article className="mx-auto grid w-full max-w-5xl gap-8 md:gap-10">
        <Link
          href="/media"
          className="group inline-flex w-fit items-center gap-2 rounded-full px-1 py-1 text-[15px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-[translate] duration-200 ease-(--ease-out) group-hover:-translate-x-0.5" />
          {t("nav.media")}
        </Link>

        <header className="grid max-w-4xl gap-4">
          <NewsDate publishedAt={news.publishedAt} className="text-base" />
          <h1 className="text-3xl leading-[1.1] font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl">
            {news.title}
          </h1>
          {news.summary && (
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              {news.summary}
            </p>
          )}
        </header>

        {news.videoUrl ? (
          <video
            src={news.videoUrl}
            poster={news.coverUrl ?? undefined}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full rounded-3xl bg-brand-night object-contain md:rounded-[2rem]"
          />
        ) : (
          news.coverUrl && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-muted md:rounded-[2rem]">
              <Image
                src={news.coverUrl}
                alt=""
                fill
                unoptimized
                priority
                sizes="(min-width: 1024px) 64rem, 100vw"
                className="object-cover"
              />
            </div>
          )
        )}

        {news.content && (
          <div className="rounded-3xl bg-card px-5 py-10 sm:px-10 md:rounded-[2rem] md:py-14 lg:px-16">
            <div
              className="rich-text mx-auto max-w-[68ch] text-lg text-foreground/85"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section
          aria-labelledby="related-news-title"
          className="grid gap-8 pt-12 md:gap-10 md:pt-20"
        >
          <SectionHeader
            id="related-news-title"
            title={t("media.related")}
            link={{ href: "/media", label: t("media.allNews") }}
          />
          <ul className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {related.map((item, index) => (
              <li key={item.slug}>
                <Reveal index={index} className="h-full">
                  <NewsCard news={item} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
