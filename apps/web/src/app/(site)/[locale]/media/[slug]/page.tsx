import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { FollowFacebookBand } from "@/components/site/follow-facebook-band";
import { ImageReveal } from "@/components/site/image-reveal";
import { NewsDate } from "@/components/site/media/news-date";
import { NewsPrevNext } from "@/components/site/media/news-prev-next";
import { NewsVideo } from "@/components/site/media/news-video";
import { Reveal } from "@/components/site/reveal";
import { getPageLocale } from "@/i18n/locale";
import { fetchNews, fetchSiteSetting } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";
import { newsPath } from "@/lib/site-links";

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
  const [news, setting] = await Promise.all([
    fetchNews(slug, locale),
    fetchSiteSetting(locale),
  ]);

  if (!news) {
    notFound();
  }

  return (
    <>
      <article>
        <header className="site-container pt-6 md:pt-8">
          <Breadcrumbs
            items={[
              { label: t("nav.home"), href: "/" },
              { label: t("nav.media"), href: "/media" },
            ]}
          />

          <Reveal className="mx-auto mt-10 grid max-w-205 gap-5 md:mt-14">
            <p className="flex gap-2.5 text-[15px] font-medium text-ink-2">
              <NewsDate publishedAt={news.publishedAt} variant="month" />
              {news.videoUrl && (
                <>
                  <span aria-hidden>·</span>
                  <span className="font-semibold text-brand-700">
                    {t("home.video")}
                  </span>
                </>
              )}
            </p>
            <h1 className="type-section text-balance text-ink">{news.title}</h1>
            {news.summary && (
              <p className="text-lg leading-relaxed text-pretty text-ink-2 md:text-xl">
                {news.summary}
              </p>
            )}
          </Reveal>
        </header>

        {news.videoUrl ? (
          <Reveal className="site-container mt-8 md:mt-12">
            <div className="mx-auto max-w-280">
              <NewsVideo
                src={news.videoUrl}
                poster={news.coverUrl}
                playLabel={t("media.playVideo")}
              />
            </div>
          </Reveal>
        ) : (
          news.coverUrl && (
            <div className="site-container mt-8 md:mt-12">
              <div className="relative mx-auto aspect-video max-w-280 overflow-hidden rounded-card bg-surface">
                <ImageReveal delay={0.15}>
                  <Image
                    src={news.coverUrl}
                    alt=""
                    fill
                    unoptimized
                    priority
                    sizes="(min-width: 1200px) 1120px, 100vw"
                    className="object-cover"
                  />
                </ImageReveal>
              </div>
            </div>
          )
        )}

        <div className="site-container pt-10 md:pt-16">
          {news.content && (
            <div
              className="rich-text mx-auto max-w-175 text-[17px] leading-[1.75] text-ink md:text-lg"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          )}
        </div>
      </article>

      <NewsPrevNext previous={news.previous} next={news.next} />

      {setting?.facebookUrl && <FollowFacebookBand url={setting.facebookUrl} />}
    </>
  );
}
