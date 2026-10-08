"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@cosmo/shared";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/form-field";
import { PasswordInput } from "@/components/admin/password-input";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { useChangePassword } from "@/lib/queries/auth";

const changePasswordFormSchema = changePasswordSchema
  .extend({ confirmPassword: z.string() })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Шинэ нууц үг таарахгүй байна",
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ["newPassword"],
    message: "Шинэ нууц үг одоогийнхоос өөр байх ёстой",
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

const EMPTY_VALUES: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  const onSubmit = handleSubmit(({ currentPassword, newPassword }) => {
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          reset(EMPTY_VALUES);
          toast.success("Нууц үг солигдлоо");
        },
        onError: (error) => {
          if (error instanceof ApiError && error.status === 400) {
            setError("currentPassword", { message: error.message });
            return;
          }

          toast.error(error.message);
        },
      },
    );
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid max-w-md gap-5">
      <FormField
        label="Одоогийн нууц үг"
        htmlFor="current-password"
        error={errors.currentPassword?.message}
      >
        <PasswordInput
          id="current-password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.currentPassword)}
          {...register("currentPassword")}
        />
      </FormField>
      <FormField
        label="Шинэ нууц үг"
        htmlFor="new-password"
        hint="Хамгийн багадаа 8 тэмдэгт"
        error={errors.newPassword?.message}
      >
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.newPassword)}
          {...register("newPassword")}
        />
      </FormField>
      <FormField
        label="Шинэ нууц үгээ давтах"
        htmlFor="confirm-password"
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          id="confirm-password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
      </FormField>
      <Button
        type="submit"
        className="w-fit"
        disabled={changePassword.isPending}
      >
        {changePassword.isPending && <Loader2 className="animate-spin" />}
        Нууц үг солих
      </Button>
    </form>
  );
}
