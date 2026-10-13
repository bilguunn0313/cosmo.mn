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
  useDeleteMilestone,
  useMilestones,
  useToggleMilestone,
} from "@/lib/queries/milestones";
import { pickDefaultTranslation } from "@/lib/translations";
import type { Milestone } from "@/lib/types";
import { MilestoneFormDialog } from "./milestone-form-dialog";

function MilestoneThumbnail({ milestone }: { milestone: Milestone }) {
  if (milestone.image) {
    return <MediaThumbnail media={milestone.image} className="aspect-video" />;
  }

  return (
    <div className="flex aspect-video items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary tabular-nums">
      {milestone.year}
    </div>
  );
}

interface MilestonesPanelProps {
  step: number;
}

export function MilestonesPanel({ step }: MilestonesPanelProps) {
  const milestones = useMilestones();
  const toggleMilestone = useToggleMilestone();
  const deleteMilestone = useDeleteMilestone();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null,
  );
  const [deletingMilestone, setDeletingMilestone] = useState<Milestone | null>(
    null,
  );

  const openForm = (milestone: Milestone | null) => {
    setEditingMilestone(milestone);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingMilestone) {
      return;
    }

    deleteMilestone.mutate(deletingMilestone.id, {
      onSuccess: () => {
        toast.success("Үйл явдал устгагдлаа");
        setDeletingMilestone(null);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={step}
        title="Компанийн түүх"
        description="Сайт дээр оноор эрэмбэлэгдсэн timeline болж харагдана. Компани байгуулагдсан он, шинэ брэнд, агуулах, салбар нээсэн зэрэг гол үйл явдлуудыг нэмнэ үү."
        action={
          <Button onClick={() => openForm(null)}>
            <Plus />
            Үйл явдал нэмэх
          </Button>
        }
      />

      <ContentList
        items={milestones.data}
        emptyText="Одоогоор үйл явдал алга. Компани байгуулагдсан оноос эхэлнэ үү."
        view={(milestone) => {
          const translation = pickDefaultTranslation(milestone.translations);

          return {
            thumbnail: <MilestoneThumbnail milestone={milestone} />,
            title: `${milestone.year} · ${translation?.title ?? "Гарчиггүй"}`,
            subtitle: translation?.description ?? undefined,
            isVisible: milestone.isVisible,
          };
        }}
        onEdit={openForm}
        onDelete={setDeletingMilestone}
        onToggleVisible={(milestone, isVisible) =>
          toggleMilestone.mutate(
            { id: milestone.id, patch: { isVisible } },
            { onError: (error) => toast.error(error.message) },
          )
        }
      />

      <MilestoneFormDialog
        milestone={editingMilestone}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />

      <ConfirmDialog
        open={deletingMilestone !== null}
        onOpenChange={(open) => !open && setDeletingMilestone(null)}
        title="Үйл явдлыг устгах уу?"
        description="Үйл явдал түүхээс бүрмөсөн хасагдана. Түр нуух бол «Харагдана» товчийг унтраана уу."
        isPending={deleteMilestone.isPending}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
