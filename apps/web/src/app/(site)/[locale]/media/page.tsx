import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/site/media/news-card";
import { NewsPagination } from "@/components/site/media/news-pagination";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { fetchNewsPage } from "@/lib/public-api";
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
  const { items, total } = await fetchNewsPage(locale, page, NEWS_PER_PAGE);
  const totalPages = Math.ceil(total / NEWS_PER_PAGE);

  if (page > 1 && items.length === 0) {
    notFound();
  }

  return (
    <>
      <header className="site-container pt-8 md:pt-14">
        <Reveal className="max-w-190">
          <h1 className="type-section text-balance text-ink">
            {t("media.title")}
          </h1>
        </Reveal>
      </header>

      <section
        aria-label={t("media.title")}
        className="site-container grid gap-12 pt-10 md:gap-14 md:pt-14"
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
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 md:gap-y-14 lg:grid-cols-3">
            {items.map((news, index) => (
              <li key={news.slug}>
                <Reveal index={index % 3} className="h-full">
                  <NewsCard news={news} priority={page === 1 && index < 3} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        <NewsPagination page={page} totalPages={totalPages} />
      </section>
    </>
  );
}
