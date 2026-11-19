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
  useDeleteRetailPartner,
  useReorderRetailPartners,
  useRetailPartners,
  useToggleRetailPartner,
} from "@/lib/queries/retail-partners";
import type { RetailPartner } from "@/lib/types";
import { RetailPartnerFormDialog } from "./retail-partner-form-dialog";

interface RetailPartnersPanelProps {
  step: number;
}

export function RetailPartnersPanel({ step }: RetailPartnersPanelProps) {
  const partners = useRetailPartners();
  const togglePartner = useToggleRetailPartner();
  const deletePartner = useDeleteRetailPartner();
  const reorderPartners = useReorderRetailPartners();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<RetailPartner | null>(
    null,
  );
  const [deletingPartner, setDeletingPartner] = useState<RetailPartner | null>(
    null,
  );

  const openForm = (partner: RetailPartner | null) => {
    setEditingPartner(partner);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingPartner) {
      return;
    }

    deletePartner.mutate(deletingPartner.id, {
      onSuccess: () => {
        toast.success("Харилцагч устгагдлаа");
        setDeletingPartner(null);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={step}
        title="Борлуулалтын сүлжээний харилцагчид"
        description="Манай бараа зарагддаг супермаркет, дэлгүүрүүдийн лого."
        action={
          <Button onClick={() => openForm(null)}>
            <Plus />
            Харилцагч нэмэх
          </Button>
        }
      />

      <ContentList
        items={partners.data}
        emptyText="Одоогоор харилцагч алга."
        view={(partner) => ({
          thumbnail: (
            <MediaThumbnail
              media={partner.logo}
              fit="contain"
              className="aspect-square bg-white ring-1 ring-border"
            />
          ),
          title: partner.name,
          isVisible: partner.isVisible,
        })}
        onEdit={openForm}
        onDelete={setDeletingPartner}
        onToggleVisible={(partner, isVisible) =>
          togglePartner.mutate(
            { id: partner.id, patch: { isVisible } },
            { onError: (error) => toast.error(error.message) },
          )
        }
        onReorder={(items) =>
          reorderPartners.mutate(items, {
            onError: (error) => toast.error(error.message),
          })
        }
      />

      <RetailPartnerFormDialog
        partner={editingPartner}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />

      <ConfirmDialog
        open={deletingPartner !== null}
        onOpenChange={(open) => !open && setDeletingPartner(null)}
        title="Харилцагчийг устгах уу?"
        description="Лого нүүр хуудаснаас бүрмөсөн арилна. Түр нуух бол «Харагдана» товчийг унтраана уу. Логоны зураг зургийн санд хэвээр үлдэнэ."
        isPending={deletePartner.isPending}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
