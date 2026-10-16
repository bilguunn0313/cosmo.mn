import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ImageReveal } from "@/components/site/image-reveal";
import { NewsDate } from "@/components/site/media/news-date";
import { NewsGrid } from "@/components/site/media/news-grid";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { fetchLatestNews, fetchNews } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";
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

  return (
    <>
      <article>
        <header className="site-container pt-6 md:pt-8">
          <Link
            href="/media"
            className="group inline-flex items-center gap-2 py-1.5 text-sm font-medium text-brand-700"
          >
            <ArrowLeft className="size-4 transition-[translate] duration-200 ease-out group-hover:-translate-x-0.5" />
            {t("media.allNews")}
          </Link>

          <Reveal className="mt-8 grid max-w-275 gap-6 md:mt-12">
            <h1 className="text-[clamp(36px,4.6vw,72px)] leading-[1.02] font-semibold tracking-heading text-balance">
              {news.title}
            </h1>
            {news.summary && (
              <p className="max-w-215 text-[clamp(19px,1.6vw,24px)] leading-[1.35] font-semibold text-pretty text-ink-2">
                {news.summary}
              </p>
            )}
          </Reveal>
        </header>

        {news.videoUrl ? (
          <div className="site-container mt-10 md:mt-14">
            <video
              src={news.videoUrl}
              poster={news.coverUrl ?? undefined}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full bg-brand-night object-contain"
            />
          </div>
        ) : (
          news.coverUrl && (
            <div className="site-container mt-10 md:mt-14">
              <div className="relative h-[min(70vh,640px)] overflow-hidden bg-surface">
                <ImageReveal delay={0.15}>
                  <Image
                    src={news.coverUrl}
                    alt=""
                    fill
                    unoptimized
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                </ImageReveal>
              </div>
            </div>
          )
        )}

        <div className="site-container grid gap-8 pt-10 md:pt-16 lg:grid-cols-12 lg:gap-x-6">
          <dl className="grid content-start gap-1 border-t border-rule pt-4 lg:sticky lg:top-30 lg:col-span-3 lg:self-start">
            <dt className="text-[13px] text-ink-3">{t("media.published")}</dt>
            <dd className="text-[22px] font-medium">
              <NewsDate publishedAt={news.publishedAt} />
            </dd>
          </dl>

          {news.content && (
            <div
              className="rich-text max-w-[68ch] text-lg text-ink lg:col-span-7 lg:col-start-5"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section
          aria-labelledby="related-news-title"
          className="site-container grid gap-6 pt-20 md:pt-32"
        >
          <SectionHeader
            id="related-news-title"
            title={t("media.related")}
            link={{ href: "/media", label: t("media.allNews") }}
          />
          <NewsGrid items={related} />
        </section>
      )}
    </>
  );
}
