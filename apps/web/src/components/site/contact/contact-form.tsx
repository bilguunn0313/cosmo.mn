"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ContactInput } from "@cosmo/shared";
import { Check, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { PublicDepartment } from "@/lib/public-api";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

const TOO_MANY_REQUESTS = 429;

const fieldClass =
  "w-full rounded-2xl border border-transparent bg-canvas px-4 text-base outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/15 aria-invalid:border-destructive";

type Translate = ReturnType<typeof useTranslations<"contact">>;

function buildSchema(t: Translate) {
  return z.object({
    name: z.string().trim().min(2, t("errors.name")).max(100, t("errors.name")),
    email: z.email(t("errors.email")),
    phone: z.string().trim().max(30, t("errors.phone")),
    departmentId: z.string(),
    message: z
      .string()
      .trim()
      .min(10, t("errors.message"))
      .max(2000, t("errors.message")),
  });
}

type ContactFormValues = z.infer<ReturnType<typeof buildSchema>>;

const EMPTY_VALUES: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  departmentId: "",
  message: "",
};

function toInput(values: ContactFormValues, locale: Locale): ContactInput {
  return {
    name: values.name,
    email: values.email,
    phone: values.phone || undefined,
    departmentId: values.departmentId ? Number(values.departmentId) : undefined,
    message: values.message,
    locale,
  };
}

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-[15px] font-medium">
        {label}
        {hint && (
          <span className="font-normal text-muted-foreground"> ({hint})</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

interface ContactFormProps {
  departments: PublicDepartment[];
}

export function ContactForm({ departments }: ContactFormProps) {
  const t = useTranslations("contact");
  const locale = useLocale() as Locale;
  const [isSent, setIsSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(buildSchema(t)),
    defaultValues: EMPTY_VALUES,
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    const response = await fetch("/api/public/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toInput(values, locale)),
    }).catch(() => null);

    if (response?.ok) {
      reset(EMPTY_VALUES);
      setIsSent(true);
      return;
    }

    setSubmitError(
      response?.status === TOO_MANY_REQUESTS
        ? t("errors.tooMany")
        : t("errors.failed"),
    );
  });

  if (isSent) {
    return (
      <div
        role="status"
        className="grid justify-items-start gap-4 py-10 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="size-7" />
        </span>
        <h3 className="text-2xl font-semibold tracking-tight">
          {t("sentTitle")}
        </h3>
        <p className="max-w-md text-muted-foreground">{t("sentText")}</p>
        <button
          type="button"
          onClick={() => setIsSent(false)}
          className="inline-flex h-11 items-center rounded-full bg-canvas px-5 text-[15px] font-medium transition-[color,scale] duration-150 ease-(--ease-out) hover:text-primary motion-safe:active:scale-[0.97]"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  const describedBy = (field: keyof ContactFormValues) =>
    errors[field] ? `contact-${field}-error` : undefined;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="contact-name"
          label={t("nameLabel")}
          error={errors.name?.message}
        >
          <input
            id="contact-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={cn(fieldClass, "h-12")}
            {...register("name")}
          />
        </Field>
        <Field
          id="contact-email"
          label={t("emailLabel")}
          error={errors.email?.message}
        >
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className={cn(fieldClass, "h-12")}
            {...register("email")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="contact-phone"
          label={t("phoneLabel")}
          hint={t("optional")}
          error={errors.phone?.message}
        >
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
            className={cn(fieldClass, "h-12")}
            {...register("phone")}
          />
        </Field>
        {departments.length > 0 && (
          <Field id="contact-department" label={t("departmentLabel")}>
            <select
              id="contact-department"
              className={cn(fieldClass, "h-12 cursor-pointer")}
              {...register("departmentId")}
            >
              <option value="">{t("general")}</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      <Field
        id="contact-message"
        label={t("messageLabel")}
        error={errors.message?.message}
      >
        <textarea
          id="contact-message"
          rows={6}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
          className={cn(fieldClass, "resize-y py-3")}
          {...register("message")}
        />
      </Field>

      <div className="grid justify-items-start gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-[15px] font-medium text-primary-foreground transition-[background-color,scale,opacity] duration-150 ease-(--ease-out) hover:bg-primary/90 disabled:opacity-70 motion-safe:active:scale-[0.97]"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? t("sending") : t("submit")}
        </button>
        {submitError && (
          <p role="alert" className="text-sm text-destructive">
            {submitError}
          </p>
        )}
      </div>
    </form>
  );
}
