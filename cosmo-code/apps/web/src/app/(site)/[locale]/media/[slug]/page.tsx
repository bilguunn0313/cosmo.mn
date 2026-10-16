import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/site/media/news-card";
import { NewsDate } from "@/components/site/media/news-date";
import { ReadingProgress } from "@/components/site/media/reading-progress";
import { ShareButtons } from "@/components/site/media/share-buttons";
import { Reveal } from "@/components/site/reveal";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { fetchLatestNews, fetchNews } from "@/lib/public-api";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { newsPath } from "@/lib/site-links";

const MAX_RELATED = 3;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/media/[slug]">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const { slug } = await params;
  const t = await getTranslations({ locale });
  const news = await fetchNews(slug, locale);

  if (!news) {
    return {};
  }

  return pageMetadata({
    locale,
    path: newsPath(news.slug),
    title: news.title,
    description: news.summary ?? t("seo.mediaDescription"),
    image: news.coverUrl,
    publishedTime: news.publishedAt,
  });
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
  const shareUrl = `${SITE_URL}/${locale}${newsPath(news.slug)}`;

  return (
    <>
      <ReadingProgress />
      <article className="site-container pt-6 md:pt-10">
        <Link
          href="/media"
          className="group inline-flex w-fit items-center gap-2 py-1.5 text-sm font-semibold text-brand-700"
        >
          <ArrowLeft className="size-4 transition-transform duration-200 ease-(--ease-out) group-hover:-translate-x-0.5" />
          {t("nav.media")}
        </Link>

        <header className="animate-in fade-in slide-in-from-bottom-6 mt-8 grid gap-5 duration-800 ease-(--ease-out) fill-mode-both md:mt-10 md:gap-6 lg:max-w-[83%]">
          <div className="eyebrow flex flex-wrap gap-3 text-ink-3">
            <NewsDate publishedAt={news.publishedAt} className="text-[13px] text-ink-3" />
            {news.videoUrl && <span className="text-brand-700">· {t("home.video")}</span>}
          </div>
          <h1 className="text-[clamp(34px,5.2vw,84px)] leading-[0.98] font-semibold tracking-heading text-balance">
            {news.title}
          </h1>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-6 mt-8 duration-900 ease-(--ease-out) fill-mode-both delay-100 md:mt-12">
          {news.videoUrl ? (
            <video
              src={news.videoUrl}
              poster={news.coverUrl ?? undefined}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full bg-brand-night object-contain lg:aspect-[21/9]"
            />
          ) : (
            news.coverUrl && (
              <div className="relative aspect-[16/10] overflow-hidden bg-surface md:aspect-video lg:aspect-[21/9]">
                <Image
                  src={news.coverUrl}
                  alt=""
                  fill
                  unoptimized
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            )
          )}
        </div>

        <div className="mt-10 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-6">
          <div className="grid content-start gap-6 lg:col-span-7 lg:col-start-4">
            {news.summary && (
              <p className="text-xl leading-normal text-ink text-pretty md:text-[clamp(20px,1.7vw,24px)]">
                {news.summary}
              </p>
            )}
            {news.content && (
              <div
                className="rich-text max-w-[70ch] text-lg leading-[1.7] text-ink-2"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            )}
          </div>
          <aside className="lg:sticky lg:top-32 lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:self-start">
            <ShareButtons
              url={shareUrl}
              labels={{
                share: t("media.share"),
                copy: t("media.copyLink"),
                copied: t("media.copied"),
              }}
            />
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section
          aria-labelledby="related-news-title"
          className="site-container pt-20 md:pt-24"
        >
          <div className="flex items-end justify-between gap-4 border-b-2 border-rule pb-5">
            <h2
              id="related-news-title"
              className="text-[clamp(28px,3.4vw,48px)] font-semibold tracking-heading"
            >
              {t("media.related")}
            </h2>
            <Link
              href="/media"
              className="inline-flex h-11 items-center px-3 text-[15px] font-medium whitespace-nowrap transition-colors hover:bg-brand-100 hover:text-brand-700"
            >
              {t("media.allNews")}
            </Link>
          </div>
          <ul className="hairline-grid mt-6 grid sm:grid-cols-2 lg:grid-cols-3">
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
    </>
  );
}
