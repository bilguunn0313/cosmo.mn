import { Play } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ImageReveal } from "@/components/site/image-reveal";
import { NewsDate } from "@/components/site/media/news-date";
import { Reveal } from "@/components/site/reveal";
import { SectionHeader } from "@/components/site/section-header";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { cn } from "@/lib/utils";

interface NewsMetaProps {
  news: PublicNewsItem;
}

async function NewsMeta({ news }: NewsMetaProps) {
  const t = await getTranslations("home");

  return (
    <div className="flex gap-2.5 text-[13px] font-semibold text-ink-3">
      <NewsDate
        publishedAt={news.publishedAt}
        className="text-[13px] text-ink-3"
      />
      <span aria-hidden>·</span>
      {news.videoUrl ? (
        <span className="text-brand-700">{t("video")}</span>
      ) : (
        <span>{t("newsLabel")}</span>
      )}
    </div>
  );
}

interface FeaturedNewsProps {
  news: PublicNewsItem;
}

async function FeaturedNews({ news }: FeaturedNewsProps) {
  const t = await getTranslations("home");

  return (
    <Link
      href={newsPath(news.slug)}
      className="group flex flex-col gap-4.5 outline-offset-4 outline-brand focus-visible:outline-2 lg:col-span-7"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-surface lg:aspect-auto lg:h-110">
        <ImageReveal>
          {news.coverUrl ? (
            <Image
              src={news.coverUrl}
              alt=""
              fill
              unoptimized
              loading="eager"
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover transition-[scale] duration-800 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          ) : (
            <div className="absolute inset-0 bg-brand" />
          )}
        </ImageReveal>
        {news.videoUrl && (
          <span className="absolute top-0 left-0 inline-flex items-center gap-2 bg-brand px-3.5 py-2 text-[13px] font-semibold text-white">
            <Play className="size-3.5 fill-current" />
            {t("video")}
          </span>
        )}
      </div>

      <Reveal delay={0.35} className="grid gap-4.5">
        <NewsMeta news={news} />
        <h3 className="text-[clamp(28px,2.5vw,36px)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance transition-colors duration-150 group-hover:text-brand-700">
          {news.title}
        </h3>
      </Reveal>
    </Link>
  );
}

interface NewsRowProps {
  news: PublicNewsItem;
  isFirst: boolean;
}

function NewsRow({ news, isFirst }: NewsRowProps) {
  return (
    <Link
      href={newsPath(news.slug)}
      className={cn(
        "group grid gap-2.5 pb-6 outline-offset-4 outline-brand focus-visible:outline-2",
        !isFirst && "border-t-2 border-rule pt-6",
      )}
    >
      <NewsMeta news={news} />
      <h3 className="line-clamp-2 text-xl leading-[1.2] font-semibold tracking-[-0.015em] transition-colors duration-150 group-hover:text-brand-700 md:text-2xl">
        {news.title}
      </h3>
    </Link>
  );
}

interface LatestNewsSectionProps {
  news: PublicNewsItem[];
}

export async function LatestNewsSection({ news }: LatestNewsSectionProps) {
  const t = await getTranslations("home");
  const [featured, ...rest] = news;

  if (!featured) {
    return null;
  }

  return (
    <section
      aria-labelledby="latest-news-title"
      className="site-container pt-20 md:pt-32"
    >
      <SectionHeader
        id="latest-news-title"
        title={t("newsTitle")}
        link={{ href: "/media", label: t("allNews") }}
      />

      <div className="mt-8 grid gap-y-12 lg:grid-cols-12 lg:gap-x-6">
        <FeaturedNews news={featured} />

        {rest.length > 0 && (
          <ul className="lg:col-span-5">
            {rest.map((item, index) => (
              <li key={item.slug}>
                <Reveal index={index}>
                  <NewsRow news={item} isFirst={index === 0} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
