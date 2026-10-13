import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/site/media/news-card";
import { NewsPagination } from "@/components/site/media/news-pagination";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import { getPageLocale } from "@/i18n/locale";
import { fetchNewsPage } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";

const NEWS_PER_PAGE = 10;
const REVEAL_COLUMNS = 3;

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

  const [featured, ...rest] = items;

  return (
    <div className="site-container-wide grid gap-8 pt-8 md:gap-10 md:pt-14">
      <div className="grid gap-4">
        <SectionHeader as="h1" id="media-title" title={t("nav.media")} />
        <p className="max-w-2xl text-lg text-muted-foreground">
          {t("media.description")}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl bg-card px-6 py-20 text-center text-lg text-muted-foreground md:rounded-[2rem]">
          {t("media.empty")}
        </div>
      ) : (
        <div className="grid gap-3 md:gap-4">
          {featured && (
            <Reveal>
              <NewsCard news={featured} isFeatured />
            </Reveal>
          )}
          {rest.length > 0 && (
            <ul className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {rest.map((news, index) => (
                <li key={news.slug}>
                  <Reveal index={index % REVEAL_COLUMNS} className="h-full">
                    <NewsCard news={news} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <NewsPagination page={page} totalPages={totalPages} />
    </div>
  );
}
