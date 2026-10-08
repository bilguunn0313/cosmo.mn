"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PanelHeader } from "@/components/admin/panel-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, initials } from "@/lib/format";
import { useAdmins, useDeleteAdmin } from "@/lib/queries/admins";
import { useMe } from "@/lib/queries/auth";
import type { Admin } from "@/lib/types";
import { AdminFormDialog } from "./admin-form-dialog";

interface AdminsPanelProps {
  step: number;
}

export function AdminsPanel({ step }: AdminsPanelProps) {
  const me = useMe();
  const admins = useAdmins();
  const deleteAdmin = useDeleteAdmin();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);

  const confirmDelete = () => {
    if (!deletingAdmin) {
      return;
    }

    deleteAdmin.mutate(deletingAdmin.id, {
      onSuccess: () => {
        toast.success(`${deletingAdmin.name} админаас хасагдлаа`);
        setDeletingAdmin(null);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={step}
        title="Админууд"
        description="Админ панелд нэвтэрч чадах хүмүүс. Ажлаас гарсан хүнийг даруй хасаарай."
        action={
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus />
            Админ нэмэх
          </Button>
        }
      />

      {admins.data ? (
        <ul className="grid gap-2">
          {admins.data.map((admin) => {
            const isMe = admin.id === me.data?.id;

            return (
              <li
                key={admin.id}
                className="flex items-center gap-3 rounded-xl border bg-card p-3"
              >
                <Avatar className="size-9 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {initials(admin.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="truncate">{admin.name}</span>
                    {isMe && <Badge variant="secondary">Та</Badge>}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    {admin.email}
                  </span>
                </div>
                <span className="hidden text-sm text-muted-foreground sm:block">
                  {formatDate(admin.createdAt)}-нд нэмэгдсэн
                </span>
                {!isMe && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`${admin.name}-г хасах`}
                    onClick={() => setDeletingAdmin(admin)}
                  >
                    <Trash2 />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="grid gap-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      )}

      <AdminFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />

      <ConfirmDialog
        open={deletingAdmin !== null}
        onOpenChange={(open) => !open && setDeletingAdmin(null)}
        title={`${deletingAdmin?.name ?? "Админ"}-г хасах уу?`}
        description="Энэ хүн админ панелд дахин нэвтэрч чадахгүй. Одоо нэвтэрсэн байгаа бол шууд гарна."
        isPending={deleteAdmin.isPending}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
