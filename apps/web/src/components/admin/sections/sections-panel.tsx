"use client";

import { ImageIcon, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ContentList } from "@/components/admin/content-list";
import { MediaThumbnail } from "@/components/admin/media/media-thumbnail";
import { PanelHeader } from "@/components/admin/panel-header";
import { Button } from "@/components/ui/button";
import { htmlToPlainText } from "@/lib/plain-text";
import {
  useDeleteSection,
  useReorderSections,
  useSaveSection,
  useSections,
} from "@/lib/queries/sections";
import { pickDefaultTranslation } from "@/lib/translations";
import type { Section, SectionPage } from "@/lib/types";
import { SectionFormDialog, type SectionBodyMode } from "./section-form-dialog";

interface SectionsPanelProps {
  page: SectionPage;
  step?: number;
  title: string;
  description: string;
  emptyText: string;
  showLink?: boolean;
  bodyMode?: SectionBodyMode;
}

function SectionThumbnail({ section }: { section: Section }) {
  if (section.image) {
    return <MediaThumbnail media={section.image} className="aspect-video" />;
  }

  return (
    <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <ImageIcon className="size-4" />
    </div>
  );
}

export function SectionsPanel({
  page,
  step,
  title,
  description,
  emptyText,
  showLink = false,
  bodyMode = "plain",
}: SectionsPanelProps) {
  const sections = useSections(page);
  const saveSection = useSaveSection(page);
  const deleteSection = useDeleteSection(page);
  const reorderSections = useReorderSections(page);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);

  const openForm = (section: Section | null) => {
    setEditingSection(section);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingSection) {
      return;
    }

    deleteSection.mutate(deletingSection.id, {
      onSuccess: () => {
        toast.success("Хэсэг устгагдлаа");
        setDeletingSection(null);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={step}
        title={title}
        description={description}
        action={
          <Button onClick={() => openForm(null)}>
            <Plus />
            Хэсэг нэмэх
          </Button>
        }
      />

      <ContentList
        items={sections.data}
        emptyText={emptyText}
        view={(section) => {
          const translation = pickDefaultTranslation(section.translations);
          const subtitle = showLink
            ? (section.linkUrl ?? "Холбоосгүй")
            : htmlToPlainText(translation?.body ?? "");

          return {
            thumbnail: <SectionThumbnail section={section} />,
            title: translation?.title ?? "Гарчиггүй",
            subtitle,
            isVisible: section.isVisible,
          };
        }}
        onEdit={openForm}
        onDelete={setDeletingSection}
        onToggleVisible={(section, isVisible) =>
          saveSection.mutate(
            { id: section.id, input: { isVisible } },
            { onError: (error) => toast.error(error.message) },
          )
        }
        onReorder={(items) =>
          reorderSections.mutate(items, {
            onError: (error) => toast.error(error.message),
          })
        }
      />

      <SectionFormDialog
        page={page}
        section={editingSection}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        showLink={showLink}
        bodyMode={bodyMode}
      />

      <ConfirmDialog
        open={deletingSection !== null}
        onOpenChange={(open) => !open && setDeletingSection(null)}
        title="Хэсгийг устгах уу?"
        description="Хэсэг сайтаас бүрмөсөн устна. Түр нуух бол «Харагдана» товчийг унтраана уу."
        isPending={deleteSection.isPending}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
