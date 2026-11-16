import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { FollowFacebookBand } from "@/components/site/follow-facebook-band";
import { NewsPagination } from "@/components/site/media/news-pagination";
import { NewsShowcase } from "@/components/site/media/news-showcase";
import { NewsSlide } from "@/components/site/media/news-slide";
import { NewsThumb } from "@/components/site/media/news-thumb";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { fetchNewsPage, fetchSiteSetting } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";

const NEWS_PER_PAGE = 24;

function parsePage(value: unknown) {
  const page = Number(value);
  return Number.isInteger(page) && page > 1 ? page : 1;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[locale]/media">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale });
  const page = parsePage((await searchParams).page);

  return pageMetadata({
    locale,
    path: page > 1 ? `/media?page=${page}` : "/media",
    title: page > 1 ? `${t("nav.media")} ${page}` : t("nav.media"),
    description: t("seo.mediaDescription"),
  });
}

export default async function MediaPage({
  params,
  searchParams,
}: PageProps<"/[locale]/media">) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();
  const page = parsePage((await searchParams).page);
  const [{ items, total }, setting] = await Promise.all([
    fetchNewsPage(locale, page, NEWS_PER_PAGE),
    fetchSiteSetting(locale),
  ]);
  const totalPages = Math.ceil(total / NEWS_PER_PAGE);

  if (page > 1 && items.length === 0) {
    notFound();
  }

  const showcaseItems = items.map((news, index) => ({
    id: news.slug,
    slide: <NewsSlide news={news} priority={index === 0} />,
    thumb: <NewsThumb news={news} priority={index === 0} />,
  }));

  return (
    <>
      <div className="site-container pt-6 md:pt-8">
        <Breadcrumbs
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("nav.media") },
          ]}
        />
      </div>

      <header className="site-container pt-10 md:pt-14">
        <Reveal className="grid max-w-190 gap-5">
          <h1 className="type-section text-balance text-ink">
            {t("media.title")}
          </h1>
          <p className="text-lg leading-relaxed text-pretty text-ink-2">
            {t("media.description")}
          </p>
        </Reveal>
      </header>

      <section
        aria-label={t("media.title")}
        className="site-container grid gap-12 pt-10 md:pt-14"
      >
        {items.length === 0 ? (
          <div className="grid justify-items-start gap-5">
            <p className="type-h3">{t("media.empty")}</p>
            <Link href="/" className={siteButtonClass("secondary")}>
              {t("notFound.backHome")}
              <ArrowRight className="size-4.5" />
            </Link>
          </div>
        ) : (
          <Reveal>
            <NewsShowcase
              items={showcaseItems}
              stripLabel={t("media.stripLabel")}
            />
          </Reveal>
        )}

        <NewsPagination page={page} totalPages={totalPages} />
      </section>

      {setting?.facebookUrl && <FollowFacebookBand url={setting.facebookUrl} />}
    </>
  );
}
