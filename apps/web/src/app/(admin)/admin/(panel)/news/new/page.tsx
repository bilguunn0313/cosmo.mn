import type { Metadata } from "next";
import { NewNews } from "@/components/admin/news/new-news";

export const metadata: Metadata = { title: "Шинэ мэдээ" };

export default function NewNewsPage() {
  return <NewNews />;
}
