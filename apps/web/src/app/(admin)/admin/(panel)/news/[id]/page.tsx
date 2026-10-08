import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsEditor } from "@/components/admin/news/news-editor";

export const metadata: Metadata = { title: "Мэдээ засах" };

export default async function EditNewsPage({
  params,
}: PageProps<"/admin/news/[id]">) {
  const { id } = await params;
  const newsId = Number(id);

  if (!Number.isInteger(newsId) || newsId < 1) {
    notFound();
  }

  return <NewsEditor newsId={newsId} />;
}
