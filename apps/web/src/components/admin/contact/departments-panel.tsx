"use client";

import { Mail, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ContentList } from "@/components/admin/content-list";
import { PanelHeader } from "@/components/admin/panel-header";
import { Button } from "@/components/ui/button";
import {
  useDeleteDepartment,
  useDepartments,
  useReorderDepartments,
  useToggleDepartment,
} from "@/lib/queries/contact-departments";
import { pickDefaultTranslation } from "@/lib/translations";
import type { ContactDepartment } from "@/lib/types";
import { DepartmentFormDialog } from "./department-form-dialog";

function DepartmentIcon() {
  return (
    <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <Mail className="size-4" />
    </div>
  );
}

interface DepartmentsPanelProps {
  step: number;
}

export function DepartmentsPanel({ step }: DepartmentsPanelProps) {
  const departments = useDepartments();
  const toggleDepartment = useToggleDepartment();
  const deleteDepartment = useDeleteDepartment();
  const reorderDepartments = useReorderDepartments();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<ContactDepartment | null>(null);
  const [deletingDepartment, setDeletingDepartment] =
    useState<ContactDepartment | null>(null);

  const openForm = (department: ContactDepartment | null) => {
    setEditingDepartment(department);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingDepartment) {
      return;
    }

    deleteDepartment.mutate(deletingDepartment.id, {
      onSuccess: () => {
        toast.success("Алба устгагдлаа");
        setDeletingDepartment(null);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={step}
        title="Албад"
        description="Холбоо барих форм дээр зочин «Хэнд хандах вэ?» гэж сонгоно. Захидал тухайн албаны имэйл рүү очно. Алба байхгүй эсвэл сонгоогүй бол ерөнхий имэйл рүү очно."
        action={
          <Button onClick={() => openForm(null)}>
            <Plus />
            Алба нэмэх
          </Button>
        }
      />

      <ContentList
        items={departments.data}
        emptyText="Одоогоор алба алга. Бүх захидал ерөнхий имэйл рүү очно."
        visibilityLabels={{ on: "Формд байна", off: "Нуугдсан" }}
        view={(department) => ({
          thumbnail: <DepartmentIcon />,
          title:
            pickDefaultTranslation(department.translations)?.name ?? "Нэргүй",
          subtitle: department.email,
          isVisible: department.isActive,
        })}
        onEdit={openForm}
        onDelete={setDeletingDepartment}
        onToggleVisible={(department, isActive) =>
          toggleDepartment.mutate(
            { id: department.id, patch: { isActive } },
            { onError: (error) => toast.error(error.message) },
          )
        }
        onReorder={(items) =>
          reorderDepartments.mutate(items, {
            onError: (error) => toast.error(error.message),
          })
        }
      />

      <DepartmentFormDialog
        department={editingDepartment}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />

      <ConfirmDialog
        open={deletingDepartment !== null}
        onOpenChange={(open) => !open && setDeletingDepartment(null)}
        title="Албыг устгах уу?"
        description="Алба формын жагсаалтаас бүрмөсөн хасагдана. Түр нуух бол «Формд байна» товчийг унтраана уу."
        isPending={deleteDepartment.isPending}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
