"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@cosmo/shared";
import type { LoginInput } from "@cosmo/shared";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/admin/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { useLogin } from "@/lib/queries/auth";

const DEFAULT_REDIRECT = "/admin";

function safeRedirectPath(next: string | null): string {
  if (next && next.startsWith("/admin") && !next.startsWith("//")) {
    return next;
  }

  return DEFAULT_REDIRECT;
}

function loginErrorMessage(error: Error) {
  if (error instanceof ApiError && error.status === 429) {
    return "Олон удаа оролдлоо. 1 минутын дараа дахин оролдоно уу";
  }

  if (error instanceof ApiError && error.status === 401) {
    return "Имэйл эсвэл нууц үг буруу байна";
  }

  return "Сервертэй холбогдож чадсангүй. Дахин оролдоно уу";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => {
        router.replace(safeRedirectPath(searchParams.get("next")));
      },
    });
  });

  return (
    <Card>
      <CardContent>
        <form onSubmit={onSubmit} noValidate className="grid gap-5">
          <FormField
            label="Имэйл"
            htmlFor="email"
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
          </FormField>

          <FormField
            label="Нууц үг"
            htmlFor="password"
            error={errors.password?.message}
          >
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="pr-10"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={
                  showPassword ? "Нууц үгийг нуух" : "Нууц үгийг харуулах"
                }
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </FormField>

          {login.error && (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {loginErrorMessage(login.error)}
            </p>
          )}

          <Button type="submit" size="lg" disabled={login.isPending}>
            {login.isPending && <Loader2 className="animate-spin" />}
            Нэвтрэх
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
