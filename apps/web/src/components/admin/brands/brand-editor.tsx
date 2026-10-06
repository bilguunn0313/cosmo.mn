"use client";

import { PageHeader } from "@/components/admin/page-header";
import { PanelHeader } from "@/components/admin/panel-header";
import { SectionsPanel } from "@/components/admin/sections/sections-panel";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrand } from "@/lib/queries/brands";
import { pickDefaultTranslation } from "@/lib/translations";
import { BackToBrands } from "./back-link";
import { BrandForm } from "./brand-form";
import { ProductsPanel } from "./products-panel";

interface BrandEditorProps {
  brandId: number;
}

export function BrandEditor({ brandId }: BrandEditorProps) {
  const brand = useBrand(brandId);

  if (brand.isError) {
    return (
      <div className="grid gap-3">
        <BackToBrands />
        <p className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
          {brand.error.message}
        </p>
      </div>
    );
  }

  if (!brand.data) {
    return (
      <div className="grid max-w-3xl gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const name = pickDefaultTranslation(brand.data.translations)?.name;

  return (
    <div className="grid gap-12">
      <div className="grid gap-3">
        <BackToBrands />
        <PageHeader
          title={name ?? brand.data.slug}
          description="Брэндийн хуудас дээрээс доош энэ дарааллаар харагдана."
          actions={
            <Badge variant={brand.data.isPublished ? "default" : "secondary"}>
              {brand.data.isPublished ? "Нийтлэгдсэн" : "Ноорог"}
            </Badge>
          }
        />
      </div>

      <section className="grid gap-4">
        <PanelHeader
          step={1}
          title="Үндсэн мэдээлэл"
          description="Нэр, лого, нүүр зураг, ангилал. Брэндүүдийн жагсаалт дээр ч мөн эдгээр харагдана."
        />
        <BrandForm key={brand.data.id} brand={brand.data} />
      </section>

      <ProductsPanel brandId={brandId} step={2} />

      <SectionsPanel
        source={{ brandId }}
        step={3}
        title="Дэлгэрэнгүй хэсгүүд"
        description="Брэндийн түүх, онцлог зэрэг зурагтай текст хэсгүүд. Бүтээгдэхүүний доор гарна."
        emptyText="Одоогоор хэсэг алга. Жишээ нь «Брэндийн түүх» хэсгээс эхэлнэ үү."
        bodyMode="rich"
      />
    </div>
  );
}
