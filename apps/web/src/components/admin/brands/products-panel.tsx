"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ContentList } from "@/components/admin/content-list";
import { MediaThumbnail } from "@/components/admin/media/media-thumbnail";
import { PanelHeader } from "@/components/admin/panel-header";
import { Button } from "@/components/ui/button";
import {
  useDeleteProduct,
  useProducts,
  useReorderProducts,
  useToggleProduct,
} from "@/lib/queries/brand-products";
import { pickDefaultTranslation } from "@/lib/translations";
import type { Product } from "@/lib/types";
import { ProductFormDialog } from "./product-form-dialog";

interface ProductsPanelProps {
  brandId: number;
  step: number;
}

export function ProductsPanel({ brandId, step }: ProductsPanelProps) {
  const products = useProducts(brandId);
  const toggleProduct = useToggleProduct(brandId);
  const deleteProduct = useDeleteProduct(brandId);
  const reorderProducts = useReorderProducts(brandId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const openForm = (product: Product | null) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingProduct) {
      return;
    }

    deleteProduct.mutate(deletingProduct.id, {
      onSuccess: () => {
        toast.success("Бүтээгдэхүүн устгагдлаа");
        setDeletingProduct(null);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={step}
        title="Бүтээгдэхүүн"
        description="Брэндийн хуудсанд зураг, нэр, товч тайлбартайгаар эгнэж харагдана. Дарахад өөр хуудас руу шилжихгүй."
        action={
          <Button onClick={() => openForm(null)}>
            <Plus />
            Бүтээгдэхүүн нэмэх
          </Button>
        }
      />

      <ContentList
        items={products.data}
        emptyText="Одоогоор бүтээгдэхүүн алга."
        view={(product) => {
          const translation = pickDefaultTranslation(product.translations);

          return {
            thumbnail: (
              <MediaThumbnail
                media={product.image}
                fit="contain"
                className="aspect-video"
              />
            ),
            title: translation?.name ?? "Нэргүй",
            subtitle: translation?.description ?? undefined,
            isVisible: product.isVisible,
          };
        }}
        onEdit={openForm}
        onDelete={setDeletingProduct}
        onToggleVisible={(product, isVisible) =>
          toggleProduct.mutate(
            { id: product.id, patch: { isVisible } },
            { onError: (error) => toast.error(error.message) },
          )
        }
        onReorder={(items) =>
          reorderProducts.mutate(items, {
            onError: (error) => toast.error(error.message),
          })
        }
      />

      <ProductFormDialog
        brandId={brandId}
        product={editingProduct}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />

      <ConfirmDialog
        open={deletingProduct !== null}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        title="Бүтээгдэхүүнийг устгах уу?"
        description="Бүтээгдэхүүн сайтаас бүрмөсөн устна. Зураг нь зургийн санд хэвээр үлдэнэ."
        isPending={deleteProduct.isPending}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
