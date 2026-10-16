import type { Metadata } from "next";
import { NewsList } from "@/components/admin/news/news-list";
import { PageBannerPanel } from "@/components/admin/page-banner-panel";

export const metadata: Metadata = { title: "Медиа" };

export default function NewsPage() {
  return (
    <div className="grid gap-12">
      <NewsList />
      <PageBannerPanel page="media" />
    </div>
  );
}
