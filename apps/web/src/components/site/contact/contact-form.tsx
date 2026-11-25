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
  formButtonClass,
  growTextarea,
  inputClass,
  labelClass,
  requiredMarkClass,
  textareaClass,
} from "@/components/site/form-styles";
import { LineSelect } from "@/components/site/line-select";
import { apiUrl } from "@/lib/api";
import type { PublicDepartment } from "@/lib/public-api";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

const TOO_MANY_REQUESTS = 429;

type Translate = ReturnType<typeof useTranslations<"contact">>;

function buildSchema(t: Translate) {
  return z.object({
    name: z.string().trim().min(2, t("errors.name")).max(100, t("errors.name")),
    email: z
      .string()
      .trim()
      .min(1, t("errors.emailRequired"))
      .pipe(z.email(t("errors.email"))),
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
  error?: string;
  isRequired?: boolean;
  className?: string;
  children: React.ReactNode;
}

function Field({
  id,
  label,
  error,
  isRequired = false,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("grid content-start gap-1", className)}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {isRequired && (
          <span aria-hidden className={requiredMarkClass}>
            {" "}
            *
          </span>
        )}
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

    const response = await fetch(apiUrl("/public/contact"), {
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
          className={formButtonClass}
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
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-x-8 gap-y-7 sm:grid-cols-2"
    >
      <Field
        id="contact-name"
        label={t("nameLabel")}
        isRequired
        error={errors.name?.message}
      >
        <input
          id="contact-name"
          autoComplete="name"
          aria-required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy("name")}
          className={cn(inputClass, "h-11")}
          {...register("name")}
        />
      </Field>

      <Field
        id="contact-email"
        label={t("emailLabel")}
        isRequired
        error={errors.email?.message}
      >
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          aria-required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("email")}
          className={cn(inputClass, "h-11")}
          {...register("email")}
        />
      </Field>
      <Field
        id="contact-phone"
        label={t("phoneLabel")}
        error={errors.phone?.message}
      >
        <input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describedBy("phone")}
          className={cn(inputClass, "h-11")}
          {...register("phone")}
        />
      </Field>

      {departments.length > 0 && (
        <Field id="contact-department" label={t("departmentLabel")}>
          <LineSelect id="contact-department" {...register("departmentId")}>
            <option value="">{t("general")}</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </LineSelect>
        </Field>
      )}

      <Field
        id="contact-message"
        label={t("messageLabel")}
        isRequired
        error={errors.message?.message}
        className="sm:col-span-2"
      >
        <textarea
          id="contact-message"
          rows={1}
          aria-required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
          onInput={growTextarea}
          className={cn(inputClass, textareaClass)}
          {...register("message")}
        />
      </Field>

      <div className="grid justify-items-start gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={formButtonClass}
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
