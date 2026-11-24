import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ImageReveal } from "@/components/site/image-reveal";
import { NewsDate } from "@/components/site/media/news-date";
import { NewsPrevNext } from "@/components/site/media/news-prev-next";
import { NewsShare } from "@/components/site/media/news-share";
import { NewsSidebar } from "@/components/site/media/news-sidebar";
import { NewsVideo } from "@/components/site/media/news-video";
import { Reveal } from "@/components/site/reveal";
import { getPageLocale } from "@/i18n/locale";
import { imageFrameStyle } from "@/lib/image-frame";
import { fetchLatestNews, fetchNews } from "@/lib/public-api";
import { paragraphsFromLineBreaks } from "@/lib/rich-text";
import { pageMetadata } from "@/lib/seo";
import { newsPath } from "@/lib/site-links";

const MORE_NEWS_COUNT = 6;
const TALLEST_COVER_RATIO = 2 / 3;

function coverAspectRatio(width: number | null, height: number | null) {
  if (!width || !height) {
    return 16 / 9;
  }

  return Math.max(TALLEST_COVER_RATIO, width / height);
}

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
    fetchLatestNews(locale, MORE_NEWS_COUNT + 1),
  ]);

  if (!news) {
    notFound();
  }

  const moreNews = latest
    .filter((item) => item.slug !== news.slug)
    .slice(0, MORE_NEWS_COUNT);

  return (
    <>
      <div className="site-container pt-8 md:pt-14">
        <div className="mx-auto grid max-w-300 gap-14 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-12 xl:gap-16">
          <article className="min-w-0">
            <Reveal>
              <header className="grid gap-4 border-b border-rule pb-8 md:pb-10">
                <p className="flex gap-2.5 text-[15px] font-medium text-ink-3">
                  <NewsDate publishedAt={news.publishedAt} variant="short" />
                  {news.videoUrl && (
                    <>
                      <span aria-hidden>·</span>
                      <span className="font-semibold text-brand-700">
                        {t("home.video")}
                      </span>
                    </>
                  )}
                </p>
                <h1 className="type-display text-pretty text-ink max-sm:text-[28px] max-sm:leading-[1.15]">
                  {news.title}
                </h1>
                {news.summary && (
                  <p className="mt-2 text-lg leading-[1.65] text-pretty text-ink-2 md:text-xl">
                    {news.summary}
                  </p>
                )}
              </header>
            </Reveal>

            {news.videoUrl ? (
              <Reveal className="mt-8 md:mt-10">
                <NewsVideo
                  src={news.videoUrl}
                  poster={news.coverUrl}
                  playLabel={t("media.playVideo")}
                />
              </Reveal>
            ) : (
              news.coverUrl && (
                <div
                  className="relative mt-8 overflow-hidden rounded-card bg-surface md:mt-10"
                  style={{
                    aspectRatio: coverAspectRatio(
                      news.coverWidth,
                      news.coverHeight,
                    ),
                  }}
                >
                  <ImageReveal delay={0.15}>
                    <Image
                      src={news.coverUrl}
                      style={imageFrameStyle(news.coverUrl)}
                      alt=""
                      fill
                      unoptimized
                      priority
                      sizes="(min-width: 1200px) 820px, 100vw"
                      className="object-cover"
                    />
                  </ImageReveal>
                </div>
              )
            )}

            <div className="mt-10 grid gap-10 md:mt-12 md:gap-12">
              {news.content && (
                <div
                  className="rich-text text-[17px] leading-[1.8] text-pretty text-ink md:text-lg"
                  dangerouslySetInnerHTML={{
                    __html: paragraphsFromLineBreaks(news.content),
                  }}
                />
              )}
              <NewsShare slug={news.slug} locale={locale} />
            </div>
          </article>

          <NewsSidebar news={moreNews} />
        </div>
      </div>

      <NewsPrevNext previous={news.previous} next={news.next} />
    </>
  );
}
