import { ArrowRight, Play } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import { NewsDate } from "./news-date";

export function PlayMark({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 -translate-1/2",
        size === "lg" ? "size-20 md:size-[104px]" : "size-16 md:size-[88px]",
      )}
    >
      <span className="pulse-ring absolute inset-0 border-2 border-white" />
      <span className="absolute inset-0 grid place-items-center bg-brand">
        <Play className="size-1/3 fill-white stroke-none" />
      </span>
    </span>
  );
}

async function VideoTag() {
  const t = await getTranslations("home");
  return (
    <span className="pointer-events-none absolute top-3 left-3 inline-flex h-8 items-center gap-1.5 bg-brand px-3 text-[13px] font-semibold text-white md:top-4 md:left-4">
      <Play className="size-3 fill-white stroke-none" />
      {t("video")}
    </span>
  );
}

function Cover({ news, sizes }: { news: PublicNewsItem; sizes: string }) {
  return news.coverUrl ? (
    <Image
      src={news.coverUrl}
      alt=""
      fill
      unoptimized
      sizes={sizes}
      className="object-cover transition-transform duration-700 ease-(--ease-out) group-hover:scale-[1.04] motion-reduce:transition-none"
    />
  ) : (
    <div className="bg-brand-gradient absolute inset-0" />
  );
}

/** Large featured story: image left, text right (stacked on mobile). */
export async function NewsLeadCard({ news }: { news: PublicNewsItem }) {
  const t = await getTranslations("media");
  const tHome = await getTranslations("home");

  return (
    <Link
      href={newsPath(news.slug)}
      className="group grid bg-white text-ink transition-colors duration-200 hover:text-brand-700 lg:grid-cols-12"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface lg:col-span-7">
        <Cover news={news} sizes="(min-width: 1024px) 60vw, 100vw" />
        {news.videoUrl && <PlayMark />}
      </div>
      <div className="flex flex-col justify-between gap-6 p-6 md:gap-8 md:p-10 lg:col-span-5 lg:p-[clamp(28px,3.4vw,56px)]">
        <div className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="whitespace-nowrap text-brand-700">{t("featured")}</span>
          <NewsDate
            publishedAt={news.publishedAt}
            className="text-[13px] whitespace-nowrap text-ink-3"
          />
          {news.videoUrl && (
            <span className="whitespace-nowrap text-ink-3">· {tHome("video")}</span>
          )}
        </div>
        <div className="grid gap-4 md:gap-5">
          <h2 className="text-[clamp(26px,3vw,48px)] leading-[1.05] font-semibold tracking-heading text-balance">
            {news.title}
          </h2>
          {news.summary && (
            <p className="line-clamp-3 text-base leading-[1.55] text-ink-2 md:line-clamp-4 md:text-[17px]">
              {news.summary}
            </p>
          )}
        </div>
        <span className="flex items-center gap-2.5 text-[15px] font-semibold text-brand-700">
          {t("read")}
          <ArrowRight className="size-5 transition-transform duration-200 ease-(--ease-out) group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/** Grid card. */
export function NewsCard({ news }: { news: PublicNewsItem }) {
  return (
    <Link
      href={newsPath(news.slug)}
      className="group flex h-full flex-col bg-paper text-ink transition-colors duration-200 hover:bg-white hover:text-brand-700"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Cover
          news={news}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        {news.videoUrl && <VideoTag />}
      </div>
      <div className="grid gap-3 px-5 pt-5 pb-6 md:px-6 md:pt-[22px] md:pb-7">
        <NewsDate
          publishedAt={news.publishedAt}
          className="text-[13px] font-semibold tracking-[0.04em] text-ink-3"
        />
        <h3 className="line-clamp-3 text-xl leading-[1.15] font-semibold tracking-heading text-balance md:text-[clamp(20px,1.8vw,26px)]">
          {news.title}
        </h3>
        {news.summary && (
          <p className="line-clamp-2 text-[15px] leading-normal text-ink-2">
            {news.summary}
          </p>
        )}
      </div>
    </Link>
  );
}
