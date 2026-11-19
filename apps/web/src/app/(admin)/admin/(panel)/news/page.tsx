import type { Metadata } from "next";
import { NewsList } from "@/components/admin/news/news-list";

export const metadata: Metadata = { title: "Медиа" };

export default function NewsPage() {
  return <NewsList />;
}
