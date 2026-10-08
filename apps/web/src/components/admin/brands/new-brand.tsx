"use client";

import { useRouter } from "next/navigation";
import { BackLink } from "@/components/admin/back-link";
import { PageHeader } from "@/components/admin/page-header";
import { BrandForm } from "./brand-form";

export function NewBrand() {
  const router = useRouter();

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <BackLink href="/admin/brands" label="Брэндүүд" />
        <PageHeader
          title="Шинэ брэнд"
          description="Эхлээд брэндийн үндсэн мэдээллийг оруулна. Бүтээгдэхүүн, дэлгэрэнгүй хэсгүүдийг дараагийн алхамд нэмнэ."
        />
      </div>
      <BrandForm
        brand={null}
        onCreated={(brand) => router.replace(`/admin/brands/${brand.id}`)}
      />
    </div>
  );
}
