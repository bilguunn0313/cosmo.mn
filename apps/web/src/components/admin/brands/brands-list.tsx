"use client";

import { BRAND_CATEGORIES } from "@cosmo/shared";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ContentList } from "@/components/admin/content-list";
import { MediaThumbnail } from "@/components/admin/media/media-thumbnail";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BRAND_CATEGORY_LABELS, categoriesLabel } from "@/lib/brand-categories";
import {
  useBrands,
  useDeleteBrand,
  useReorderBrands,
  useUpdateBrand,
} from "@/lib/queries/brands";
import { pickDefaultTranslation } from "@/lib/translations";
import type { Brand, BrandCategory } from "@/lib/types";

type CategoryFilter = BrandCategory | "ALL";

function BrandLogo({ brand, name }: { brand: Brand; name: string }) {
  if (brand.logo) {
    return (
      <MediaThumbnail
        media={brand.logo}
        fit="contain"
        className="aspect-video border bg-white"
      />
    );
  }

  return (
    <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-lg font-semibold text-muted-foreground">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function BrandsList() {
  const router = useRouter();
  const brands = useBrands();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();
  const reorderBrands = useReorderBrands();

  const [category, setCategory] = useState<CategoryFilter>("ALL");
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);

  const visibleBrands =
    category === "ALL"
      ? brands.data
      : brands.data?.filter((brand) => brand.categories.includes(category));

  const confirmDelete = () => {
    if (!deletingBrand) {
      return;
    }

    deleteBrand.mutate(deletingBrand.id, {
      onSuccess: () => {
        toast.success("Брэнд устгагдлаа");
        setDeletingBrand(null);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <div className="grid gap-8">
      <PageHeader
        title="Брэндүүд"
        description="Сайтын «Брэндүүд» хуудас болон нүүр хуудсанд энэ дарааллаар харагдана."
        actions={
          <Button
            nativeButton={false}
            render={<Link href="/admin/brands/new" />}
          >
            <Plus />
            Брэнд нэмэх
          </Button>
        }
      />

      <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={category}
            onValueChange={(value) => setCategory(value as CategoryFilter)}
          >
            <TabsList>
              <TabsTrigger value="ALL">Бүгд</TabsTrigger>
              {BRAND_CATEGORIES.map((item) => (
                <TabsTrigger key={item} value={item}>
                  {BRAND_CATEGORY_LABELS[item]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {category !== "ALL" && (
            <p className="text-sm text-muted-foreground">
              Дараалал солих бол «Бүгд»-ийг сонгоно уу
            </p>
          )}
        </div>

        <ContentList
          items={visibleBrands}
          emptyText={
            category === "ALL"
              ? "Одоогоор брэнд алга. «Брэнд нэмэх» дээр дарж эхэлнэ үү."
              : "Энэ ангилалд брэнд алга."
          }
          reorderable={category === "ALL"}
          visibilityLabels={{ on: "Нийтлэгдсэн", off: "Ноорог" }}
          view={(brand) => {
            const name =
              pickDefaultTranslation(brand.translations)?.name ?? brand.slug;

            return {
              thumbnail: <BrandLogo brand={brand} name={name} />,
              title: name,
              subtitle: `${categoriesLabel(brand.categories)} · /brands/${brand.slug}`,
              isVisible: brand.isPublished,
            };
          }}
          onEdit={(brand) => router.push(`/admin/brands/${brand.id}`)}
          onDelete={setDeletingBrand}
          onToggleVisible={(brand, isPublished) =>
            updateBrand.mutate(
              { id: brand.id, input: { isPublished } },
              { onError: (error) => toast.error(error.message) },
            )
          }
          onReorder={(items) =>
            reorderBrands.mutate(items, {
              onError: (error) => toast.error(error.message),
            })
          }
        />
      </div>

      <ConfirmDialog
        open={deletingBrand !== null}
        onOpenChange={(open) => !open && setDeletingBrand(null)}
        title="Брэндийг устгах уу?"
        description="Брэндийн бүтээгдэхүүн, дэлгэрэнгүй хэсгүүд хамт бүрмөсөн устна. Зургууд зургийн санд хэвээр үлдэнэ. Түр нуух бол «Нийтлэгдсэн» товчийг унтраана уу."
        isPending={deleteBrand.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
