"use client";

import { BackLink } from "@/components/admin/back-link";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNews } from "@/lib/queries/news";
import { pickDefaultTranslation } from "@/lib/translations";
import { NewsForm } from "./news-form";

interface NewsEditorProps {
  newsId: number;
}

export function NewsEditor({ newsId }: NewsEditorProps) {
  const news = useNews(newsId);

  if (news.isError) {
    return (
      <div className="grid gap-3">
        <BackLink href="/admin/news" label="Медиа" />
        <p className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
          {news.error.message}
        </p>
      </div>
    );
  }

  if (!news.data) {
    return (
      <div className="grid max-w-3xl gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const title = pickDefaultTranslation(news.data.translations)?.title;

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <BackLink href="/admin/news" label="Медиа" />
        <PageHeader
          title={title ?? news.data.slug}
          actions={
            <Badge variant={news.data.isPublished ? "default" : "secondary"}>
              {news.data.isPublished ? "Нийтлэгдсэн" : "Ноорог"}
            </Badge>
          }
        />
      </div>
      <NewsForm key={news.data.id} news={news.data} />
    </div>
  );
}
