import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { Link } from "@/i18n/navigation";
import type { PublicNewsItem } from "@/lib/public-api";
import { newsPath } from "@/lib/site-links";
import { NewsCover } from "./news-cover";
import { NewsMeta } from "./news-meta";

interface NewsSlideProps {
  news: PublicNewsItem;
  priority?: boolean;
  titleTag?: "h2" | "h3";
  eyebrow?: string;
}

export async function NewsSlide({
  news,
  priority = false,
  titleTag = "h2",
  eyebrow,
}: NewsSlideProps) {
  const t = await getTranslations("home");
  const Title = titleTag;

  return (
    <Link
      href={newsPath(news.slug)}
      className="group grid gap-6 rounded-card outline-offset-4 outline-brand focus-visible:outline-2 lg:grid-cols-12 lg:items-center lg:gap-x-14"
    >
      <NewsCover
        news={news}
        priority={priority}
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="aspect-16/10 rounded-card lg:col-span-7"
      />

      <div className="grid justify-items-start gap-4 lg:col-span-5">
        {eyebrow && <SectionEyebrow className="mb-1">{eyebrow}</SectionEyebrow>}
        <NewsMeta news={news} />
        <Title className="line-clamp-4 type-h2 text-balance text-ink transition-colors duration-150 group-hover:text-brand-700">
          {news.title}
        </Title>
        {news.summary && (
          <p className="line-clamp-3 text-[17px] leading-relaxed text-pretty text-ink-2">
            {news.summary}
          </p>
        )}
        <span className="mt-1 inline-flex items-center gap-2 py-1 text-[15px] font-semibold text-brand-700">
          {t("learnMore")}
          <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
