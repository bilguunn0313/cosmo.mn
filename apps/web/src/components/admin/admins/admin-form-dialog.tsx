"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createAdminSchema, type CreateAdminInput } from "@cosmo/shared";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/admin/form-field";
import { PasswordInput } from "@/components/admin/password-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { useCreateAdmin } from "@/lib/queries/admins";

interface AdminFormProps {
  onDone: () => void;
}

function AdminForm({ onDone }: AdminFormProps) {
  const createAdmin = useCreateAdmin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateAdminInput>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    createAdmin.mutate(values, {
      onSuccess: (admin) => {
        toast.success(`${admin.name} админ боллоо`);
        onDone();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError("email", { message: "Энэ имэйлтэй админ аль хэдийн бий" });
          return;
        }

        toast.error(error.message);
      },
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <FormField
        label="Нэр"
        htmlFor="admin-name"
        required
        error={errors.name?.message}
      >
        <Input
          id="admin-name"
          autoComplete="off"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
      </FormField>
      <FormField
        label="Имэйл"
        htmlFor="admin-email"
        required
        hint="Нэвтрэхдээ энэ имэйлийг ашиглана"
        error={errors.email?.message}
      >
        <Input
          id="admin-email"
          type="email"
          autoComplete="off"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </FormField>
      <FormField
        label="Түр нууц үг"
        htmlFor="admin-password"
        required
        hint="Хамгийн багадаа 8 тэмдэгт. Шинэ админд биечлэн эсвэл утсаар хэлээд, анх нэвтэрмэгц солиулаарай"
        error={errors.password?.message}
      >
        <PasswordInput
          id="admin-password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
      </FormField>

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onDone}>
          Болих
        </Button>
        <Button type="submit" disabled={createAdmin.isPending}>
          {createAdmin.isPending && <Loader2 className="animate-spin" />}
          Админ нэмэх
        </Button>
      </DialogFooter>
    </form>
  );
}

interface AdminFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminFormDialog({ open, onOpenChange }: AdminFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Шинэ админ</DialogTitle>
          <DialogDescription>
            Бүх админ адил эрхтэй: сайтын бүх агуулгыг засаж, бусад админыг
            нэмж, устгаж чадна.
          </DialogDescription>
        </DialogHeader>
        {open && <AdminForm onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
