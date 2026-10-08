"use client";

import { useRouter } from "next/navigation";
import { BackLink } from "@/components/admin/back-link";
import { PageHeader } from "@/components/admin/page-header";
import { NewsForm } from "./news-form";

export function NewNews() {
  const router = useRouter();

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <BackLink href="/admin/news" label="Медиа" />
        <PageHeader
          title="Шинэ мэдээ"
          description="Нийтлэх унтраалгыг асаалгүй хадгалбал ноорог болж, зөвхөн админд харагдана."
        />
      </div>
      <NewsForm
        news={null}
        onCreated={(news) => router.replace(`/admin/news/${news.id}`)}
      />
    </div>
  );
}
