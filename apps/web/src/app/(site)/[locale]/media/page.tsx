import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { FeaturedNews } from "@/components/site/media/featured-news";
import { NewsGrid } from "@/components/site/media/news-grid";
import { NewsPagination } from "@/components/site/media/news-pagination";
import { PageBanner } from "@/components/site/page-banner";
import { siteButtonClass } from "@/components/site/site-button";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { pageBannerUrl } from "@/lib/page-banners";
import { fetchNewsPage, fetchSiteSetting } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";

const NEWS_PER_PAGE = 10;

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

  const featured = page === 1 ? items[0] : undefined;
  const gridItems = featured ? items.slice(1) : items;

  return (
    <>
      <PageBanner
        title={t("nav.media")}
        description={t("media.description")}
        imageUrl={pageBannerUrl(setting, "media")}
      />

      <div className="site-container grid gap-10 pt-14 md:gap-14 md:pt-20">
        {items.length === 0 ? (
          <div className="grid justify-items-start gap-5 border-b border-rule pb-20">
            <p className="text-2xl font-semibold tracking-heading md:text-[32px]">
              {t("media.empty")}
            </p>
            <Link href="/" className={siteButtonClass("secondary")}>
              {t("notFound.backHome")}
              <ArrowRight className="size-4.5" />
            </Link>
          </div>
        ) : (
          <>
            {featured && <FeaturedNews news={featured} />}
            {gridItems.length > 0 && <NewsGrid items={gridItems} />}
          </>
        )}

        <NewsPagination page={page} totalPages={totalPages} />
      </div>
    </>
  );
}
