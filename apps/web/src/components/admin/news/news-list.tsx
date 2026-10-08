"use client";

import { Newspaper, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ContentList } from "@/components/admin/content-list";
import { MediaThumbnail } from "@/components/admin/media/media-thumbnail";
import { PageHeader } from "@/components/admin/page-header";
import { Pagination } from "@/components/admin/pagination";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import {
  NEWS_PAGE_SIZE,
  useDeleteNews,
  useNewsList,
  useToggleNews,
} from "@/lib/queries/news";
import { pickDefaultTranslation } from "@/lib/translations";
import type { News } from "@/lib/types";

function NewsThumbnail({ news }: { news: News }) {
  const media = news.coverImage ?? news.video;

  if (media) {
    return <MediaThumbnail media={media} className="aspect-video" />;
  }

  return (
    <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <Newspaper className="size-4" />
    </div>
  );
}

function publishStatus(news: News) {
  if (!news.isPublished || !news.publishedAt) {
    return "Ноорог";
  }

  const date = formatDate(news.publishedAt);
  return new Date(news.publishedAt) > new Date() ? `Товлосон: ${date}` : date;
}

export function NewsList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const newsList = useNewsList(page);
  const toggleNews = useToggleNews();
  const deleteNews = useDeleteNews();
  const [deletingNews, setDeletingNews] = useState<News | null>(null);

  const confirmDelete = () => {
    if (!deletingNews) {
      return;
    }

    deleteNews.mutate(deletingNews.id, {
      onSuccess: () => {
        toast.success("Мэдээ устгагдлаа");
        setDeletingNews(null);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <div className="grid gap-8">
      <PageHeader
        title="Медиа"
        description="Сайтын «Медиа» хуудсанд хамгийн сүүлд нийтлэгдсэн мэдээ эхэнд харагдана."
        actions={
          <Button nativeButton={false} render={<Link href="/admin/news/new" />}>
            <Plus />
            Мэдээ нэмэх
          </Button>
        }
      />

      <div className="grid gap-4">
        <ContentList
          items={newsList.data?.items}
          emptyText="Одоогоор мэдээ алга. «Мэдээ нэмэх» дээр дарж эхэлнэ үү."
          visibilityLabels={{ on: "Нийтлэгдсэн", off: "Ноорог" }}
          view={(news) => ({
            thumbnail: <NewsThumbnail news={news} />,
            title:
              pickDefaultTranslation(news.translations)?.title ?? news.slug,
            subtitle: publishStatus(news),
            isVisible: news.isPublished,
          })}
          onEdit={(news) => router.push(`/admin/news/${news.id}`)}
          onDelete={setDeletingNews}
          onToggleVisible={(news, isPublished) =>
            toggleNews.mutate(
              { id: news.id, patch: { isPublished } },
              { onError: (error) => toast.error(error.message) },
            )
          }
        />

        {newsList.data && (
          <Pagination
            page={page}
            limit={NEWS_PAGE_SIZE}
            total={newsList.data.total}
            onPageChange={setPage}
          />
        )}
      </div>

      <ConfirmDialog
        open={deletingNews !== null}
        onOpenChange={(open) => !open && setDeletingNews(null)}
        title="Мэдээг устгах уу?"
        description="Мэдээ сайтаас бүрмөсөн устна. Зураг, видео нь зургийн санд хэвээр үлдэнэ. Түр нуух бол «Нийтлэгдсэн» товчийг унтраана уу."
        isPending={deleteNews.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
