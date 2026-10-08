"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ContentList } from "@/components/admin/content-list";
import { MediaThumbnail } from "@/components/admin/media/media-thumbnail";
import { Button } from "@/components/ui/button";
import {
  useDeleteSlide,
  useReorderSlides,
  useSlides,
  useToggleSlide,
} from "@/lib/queries/slides";
import { pickDefaultTranslation } from "@/lib/translations";
import type { Slide } from "@/lib/types";
import { PanelHeader } from "@/components/admin/panel-header";
import { SlideFormDialog } from "./slide-form-dialog";

export function SlidesPanel() {
  const slides = useSlides();
  const toggleSlide = useToggleSlide();
  const deleteSlide = useDeleteSlide();
  const reorderSlides = useReorderSlides();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [deletingSlide, setDeletingSlide] = useState<Slide | null>(null);

  const openForm = (slide: Slide | null) => {
    setEditingSlide(slide);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingSlide) {
      return;
    }

    deleteSlide.mutate(deletingSlide.id, {
      onSuccess: () => {
        toast.success("Слайд устгагдлаа");
        setDeletingSlide(null);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={1}
        title="Дээд талын carousel"
        description="Сайтад орж ирэхэд дэлгэц дүүрэн харагдах видео эсвэл зургууд. Дээрээс доош дарааллаар солигдоно."
        action={
          <Button onClick={() => openForm(null)}>
            <Plus />
            Слайд нэмэх
          </Button>
        }
      />

      <ContentList
        items={slides.data}
        emptyText="Одоогоор слайд алга. «Слайд нэмэх» дээр дарж эхний слайдаа нэмнэ үү."
        view={(slide) => {
          const translation = pickDefaultTranslation(slide.translations);
          return {
            thumbnail: (
              <MediaThumbnail media={slide.media} className="aspect-video" />
            ),
            title: translation?.title ?? "Гарчиггүй",
            subtitle: translation?.subtitle ?? undefined,
            isVisible: slide.isActive,
          };
        }}
        onEdit={openForm}
        onDelete={setDeletingSlide}
        onToggleVisible={(slide, isActive) =>
          toggleSlide.mutate(
            { id: slide.id, patch: { isActive } },
            { onError: (error) => toast.error(error.message) },
          )
        }
        onReorder={(items) =>
          reorderSlides.mutate(items, {
            onError: (error) => toast.error(error.message),
          })
        }
      />

      <SlideFormDialog
        slide={editingSlide}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />

      <ConfirmDialog
        open={deletingSlide !== null}
        onOpenChange={(open) => !open && setDeletingSlide(null)}
        title="Слайдыг устгах уу?"
        description="Слайд сайтаас бүрмөсөн устна. Түр нуух бол «Харагдана» товчийг унтраана уу. Видео, зураг нь зургийн санд хэвээр үлдэнэ."
        isPending={deleteSlide.isPending}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
