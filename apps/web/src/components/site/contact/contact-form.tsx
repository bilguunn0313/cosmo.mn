"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ContactInput } from "@cosmo/shared";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  errorClass,
  inputClass,
  labelClass,
} from "@/components/site/form-styles";
import { siteButtonClass } from "@/components/site/site-button";
import type { PublicDepartment } from "@/lib/public-api";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

const TOO_MANY_REQUESTS = 429;

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
    <div className="grid content-start gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
        {hint && <span className="font-normal text-ink-3"> ({hint})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={errorClass}>
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
        className="animate-in fade-in slide-in-from-bottom-4 grid justify-items-start gap-5 duration-500 ease-(--ease-out)"
      >
        <span className="flex size-14 items-center justify-center rounded-control bg-brand-100 text-brand">
          <Check className="size-7" strokeWidth={2} />
        </span>
        <h3 className="type-h4">{t("sentTitle")}</h3>
        <p className="max-w-md text-base leading-relaxed text-ink-2">
          {t("sentText")}
        </p>
        <button
          type="button"
          onClick={() => setIsSent(false)}
          className={siteButtonClass("secondary", "min-w-50")}
        >
          {t("sendAnother")}
          <ArrowRight className="size-4.5" />
        </button>
      </div>
    );
  }

  const describedBy = (field: keyof ContactFormValues) =>
    errors[field] ? `contact-${field}-error` : undefined;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
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
          className={cn(inputClass, "h-12")}
          {...register("name")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
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
            className={cn(inputClass, "h-12")}
            {...register("email")}
          />
        </Field>
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
            className={cn(inputClass, "h-12")}
            {...register("phone")}
          />
        </Field>
      </div>

      {departments.length > 0 && (
        <Field id="contact-department" label={t("departmentLabel")}>
          <select
            id="contact-department"
            className={cn(inputClass, "h-12 cursor-pointer")}
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
          className={cn(inputClass, "resize-y py-3")}
          {...register("message")}
        />
      </Field>

      <div className="grid gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={siteButtonClass("primary", "w-full disabled:opacity-70")}
        >
          {isSubmitting ? t("sending") : t("submit")}
          {isSubmitting ? (
            <Loader2 className="size-4.5 animate-spin" />
          ) : (
            <ArrowRight className="size-4.5" />
          )}
        </button>
        {submitError && (
          <p role="alert" className={errorClass}>
            {submitError}
          </p>
        )}
      </div>
    </form>
  );
}
