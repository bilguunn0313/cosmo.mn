import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { NewsCard, NewsLeadCard } from "@/components/site/media/news-card";
import { NewsPagination } from "@/components/site/media/news-pagination";
import { Reveal } from "@/components/site/reveal";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
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
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const onlyVideo = sp.type === "video";

  const [{ items, total }, all, videos] = await Promise.all([
    fetchNewsPage(locale, page, NEWS_PER_PAGE, { video: onlyVideo }),
    fetchNewsPage(locale, 1, 1),
    fetchNewsPage(locale, 1, 1, { video: true }),
  ]);
  const totalPages = Math.ceil(total / NEWS_PER_PAGE);

  if (page > 1 && items.length === 0) {
    notFound();
  }

  const [featured, ...rest] = items;
  const tabs = [
    { key: "all", label: t("media.all"), count: all.total, active: !onlyVideo, query: {} },
    { key: "video", label: t("home.video"), count: videos.total, active: onlyVideo, query: { type: "video" } },
  ];

  return (
    <div className="site-container grid gap-8 pt-10 md:gap-10 md:pt-[72px]">
      <header className="grid gap-4 md:grid-cols-12 md:items-end md:gap-6">
        <h1 className="animate-in fade-in slide-in-from-bottom-6 text-[clamp(56px,9vw,144px)] leading-[0.9] font-semibold tracking-heading duration-900 ease-(--ease-out) fill-mode-both md:col-span-7">
          {t("nav.media")}
        </h1>
        <p className="animate-in fade-in slide-in-from-bottom-6 text-lg leading-normal text-ink-2 text-pretty duration-900 ease-(--ease-out) fill-mode-both delay-150 md:col-span-5 md:pb-3 md:text-[19px]">
          {t("media.description")}
        </p>
      </header>

      <nav
        aria-label={t("nav.media")}
        className="no-scrollbar -mx-4 -mb-4 overflow-x-auto border-b-2 border-rule px-4 md:mx-0 md:mt-4 md:px-0"
      >
        <ul className="flex gap-1">
          {tabs.map((tab) => (
            <li key={tab.key}>
              <Link
                href={{ pathname: "/media", query: tab.query }}
                scroll={false}
                aria-current={tab.active ? "page" : undefined}
                className="-mb-[2px] inline-flex items-baseline gap-2 border-b-4 border-transparent px-3 pt-4 pb-3.5 text-base font-medium whitespace-nowrap transition-colors duration-200 hover:text-brand-700 aria-[current=page]:border-brand aria-[current=page]:text-brand-700 md:px-4 md:text-[17px]"
              >
                {tab.label}
                <span className="text-[13px] font-semibold text-ink-3 tabular-nums">
                  {tab.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {items.length === 0 ? (
        <p className="border-b-2 border-rule py-20 text-2xl font-semibold tracking-heading md:text-[32px]">
          {t("media.empty")}
        </p>
      ) : (
        <div className="grid gap-8">
          {featured && page === 1 && (
            <Reveal>
              <NewsLeadCard news={featured} />
            </Reveal>
          )}
          {(page === 1 ? rest : items).length > 0 && (
            <ul className="hairline-grid grid sm:grid-cols-2 lg:grid-cols-3">
              {(page === 1 ? rest : items).map((news, index) => (
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

      <NewsPagination
        page={page}
        totalPages={totalPages}
        query={onlyVideo ? { type: "video" } : {}}
      />
    </div>
  );
}
