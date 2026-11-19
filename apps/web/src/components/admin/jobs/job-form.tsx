"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  EMPLOYMENT_TYPES,
  JOB_DEPARTMENTS,
  JOB_STAGES,
  slugify,
  slugSchema,
  toCompanyDate,
  type CreateJobPostingInput,
} from "@cosmo/shared";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/form-field";
import { OptionSelect } from "@/components/admin/option-select";
import { PrefixedInput } from "@/components/admin/prefixed-input";
import { SaveBar } from "@/components/admin/save-bar";
import { TranslationTabs } from "@/components/admin/translation-tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import { useCreateJob, useUpdateJob } from "@/lib/queries/jobs";
import {
  emptyTranslations,
  formToTranslations,
  isTranslationFilled,
  translationsToForm,
} from "@/lib/translations";
import type { JobPosting } from "@/lib/types";
import {
  DEPARTMENT_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  STAGE_LABELS,
} from "./job-labels";

type JobTranslationValues = {
  title: string;
  location: string;
  salary: string;
  summary: string;
  duties: string;
  requirements: string;
  offers: string;
};

const EMPTY_TRANSLATION: JobTranslationValues = {
  title: "",
  location: "",
  salary: "",
  summary: "",
  duties: "",
  requirements: "",
  offers: "",
};

const LIST_FIELDS = [
  { name: "duties", label: "Гүйцэтгэх үүрэг" },
  { name: "requirements", label: "Тавигдах шаардлага" },
  { name: "offers", label: "Бид санал болгоно" },
] as const;

const LIST_HINT = "Мөр бүрт нэг зүйл бичнэ. Сайт дээр жагсаалт болж харагдана";

const translationSchema = z.object({
  title: z.string().trim().max(200),
  location: z.string().trim().max(200),
  salary: z.string().trim().max(200),
  summary: z.string().trim().max(1000),
  duties: z.string().trim().max(5000),
  requirements: z.string().trim().max(5000),
  offers: z.string().trim().max(5000),
});

const jobFormSchema = z
  .object({
    slug: slugSchema,
    department: z.enum(JOB_DEPARTMENTS),
    employmentType: z.enum(EMPLOYMENT_TYPES),
    stage: z.enum(JOB_STAGES),
    openedOn: z.iso.date({ error: "Нээх огноог сонгоно уу" }),
    closesOn: z.union([z.literal(""), z.iso.date()]),
    isPublished: z.boolean(),
    translations: z
      .object({
        mn: translationSchema,
        en: translationSchema,
        zh: translationSchema,
      })
      .superRefine((translations, context) => {
        for (const locale of ["mn", "en", "zh"] as const) {
          const values = translations[locale];
          const isRequired = locale === "mn" || isTranslationFilled(values);

          if (isRequired && values.title.trim() === "") {
            context.addIssue({
              code: "custom",
              path: [locale, "title"],
              message: locale === "mn" ? "Нэр заавал" : "Нэр бичнэ үү",
            });
          }
        }
      }),
  })
  .refine(
    (values) => values.closesOn === "" || values.closesOn >= values.openedOn,
    {
      path: ["closesOn"],
      message: "Хаах огноо нь нээх огнооноос хойш байна",
    },
  );

type JobFormValues = z.infer<typeof jobFormSchema>;

function defaultValues(job: JobPosting | null): JobFormValues {
  if (!job) {
    return {
      slug: "",
      department: "sales",
      employmentType: "FULL_TIME",
      stage: "OPEN",
      openedOn: toCompanyDate(new Date()),
      closesOn: "",
      isPublished: false,
      translations: emptyTranslations(EMPTY_TRANSLATION),
    };
  }

  return {
    slug: job.slug,
    department: job.department,
    employmentType: job.employmentType,
    stage: job.stage,
    openedOn: toCompanyDate(job.openedAt),
    closesOn: job.closesAt ? toCompanyDate(job.closesAt) : "",
    isPublished: job.isPublished,
    translations: translationsToForm(job.translations, EMPTY_TRANSLATION),
  };
}

function toInput(values: JobFormValues): CreateJobPostingInput {
  return {
    slug: values.slug,
    department: values.department,
    employmentType: values.employmentType,
    stage: values.stage,
    openedOn: values.openedOn,
    closesOn: values.closesOn === "" ? null : values.closesOn,
    isPublished: values.isPublished,
    translations: formToTranslations(
      values.translations,
    ) as CreateJobPostingInput["translations"],
  };
}

interface JobFormProps {
  job: JobPosting | null;
  onCreated?: (job: JobPosting) => void;
}

export function JobForm({ job, onCreated }: JobFormProps) {
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const isPending = createJob.isPending || updateJob.isPending;
  const [isSlugEdited, setIsSlugEdited] = useState(job !== null);
  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: defaultValues(job),
  });

  const translations = useWatch({ control, name: "translations" });

  const onError = (error: Error) => {
    if (error instanceof ApiError && error.status === 409) {
      setError("slug", {
        message: "Энэ хаяг өөр ажлын байранд ашиглагдсан байна",
      });
    }

    toast.error(error.message);
  };

  const submit = handleSubmit((values) => {
    const input = toInput(values);

    if (job) {
      updateJob.mutate(
        { id: job.id, input },
        {
          onSuccess: (savedJob) => {
            reset(defaultValues(savedJob));
            toast.success("Ажлын байр хадгалагдлаа");
          },
          onError,
        },
      );
      return;
    }

    createJob.mutate(input, {
      onSuccess: (createdJob) => {
        toast.success(
          createdJob.isPublished
            ? "Ажлын байр нийтлэгдлээ"
            : "Ноорог хадгалагдлаа",
        );
        onCreated?.(createdJob);
      },
      onError,
    });
  });

  return (
    <form onSubmit={submit} noValidate className="grid max-w-3xl gap-8">
      <TranslationTabs
        hasError={(locale) => Boolean(errors.translations?.[locale])}
        isFilled={(locale) => isTranslationFilled(translations[locale])}
      >
        {(locale) => (
          <>
            <FormField
              label="Ажлын байрны нэр"
              htmlFor={`job-title-${locale}`}
              required={locale === "mn"}
              error={errors.translations?.[locale]?.title?.message}
            >
              <Input
                id={`job-title-${locale}`}
                aria-invalid={Boolean(errors.translations?.[locale]?.title)}
                {...register(`translations.${locale}.title`, {
                  onChange: (event) => {
                    if (locale === "mn" && !isSlugEdited) {
                      setValue("slug", slugify(event.target.value));
                    }
                  },
                })}
              />
            </FormField>
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                label="Байршил"
                htmlFor={`job-location-${locale}`}
                hint="Жишээ нь: Улаанбаатар"
              >
                <Input
                  id={`job-location-${locale}`}
                  {...register(`translations.${locale}.location`)}
                />
              </FormField>
              <FormField
                label="Цалин"
                htmlFor={`job-salary-${locale}`}
                hint="Хоосон бол «Тохиролцоно» гэж харагдана"
              >
                <Input
                  id={`job-salary-${locale}`}
                  {...register(`translations.${locale}.salary`)}
                />
              </FormField>
            </div>
            <FormField
              label="Товч танилцуулга"
              htmlFor={`job-summary-${locale}`}
              hint="Дэлгэрэнгүй хуудасны эхэнд 1–2 өгүүлбэрээр харагдана"
            >
              <Textarea
                id={`job-summary-${locale}`}
                rows={2}
                {...register(`translations.${locale}.summary`)}
              />
            </FormField>
            {LIST_FIELDS.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                htmlFor={`job-${field.name}-${locale}`}
                hint={LIST_HINT}
              >
                <Textarea
                  id={`job-${field.name}-${locale}`}
                  rows={5}
                  {...register(`translations.${locale}.${field.name}`)}
                />
              </FormField>
            ))}
          </>
        )}
      </TranslationTabs>

      <FormField
        label="Хуудасны хаяг"
        htmlFor="job-slug"
        required
        hint={
          job
            ? "Өөрчилбөл хуучин хаягаар хуваалцсан холбоосууд ажиллахаа болино"
            : "Монгол нэрээс автоматаар үүснэ. Хүсвэл өөрчилж болно"
        }
        error={errors.slug?.message}
      >
        <PrefixedInput
          id="job-slug"
          prefix="cosmo.mn/human-resources/jobs/"
          aria-invalid={Boolean(errors.slug)}
          {...register("slug", { onChange: () => setIsSlugEdited(true) })}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Хэлтэс" htmlFor="job-department" required>
          <Controller
            control={control}
            name="department"
            render={({ field }) => (
              <OptionSelect
                id="job-department"
                value={field.value}
                labels={DEPARTMENT_LABELS}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
        <FormField label="Ажлын цаг" htmlFor="job-employment-type" required>
          <Controller
            control={control}
            name="employmentType"
            render={({ field }) => (
              <OptionSelect
                id="job-employment-type"
                value={field.value}
                labels={EMPLOYMENT_TYPE_LABELS}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
      </div>

      <FormField
        label="Явц"
        htmlFor="job-stage"
        hint="Ажлын байрны хүснэгтийн «Явц» баганад харагдана. «Шийдвэр гарсан» үед анкет илгээх товч хаагдана"
      >
        <Controller
          control={control}
          name="stage"
          render={({ field }) => (
            <OptionSelect
              id="job-stage"
              value={field.value}
              labels={STAGE_LABELS}
              onChange={field.onChange}
              className="sm:w-72"
            />
          )}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Нээх огноо"
          htmlFor="job-opened-on"
          required
          hint="Энэ өдрөөс сайт дээр харагдана"
          error={errors.openedOn?.message}
        >
          <Input
            id="job-opened-on"
            type="date"
            className="w-fit"
            aria-invalid={Boolean(errors.openedOn)}
            {...register("openedOn")}
          />
        </FormField>
        <FormField
          label="Хаах огноо"
          htmlFor="job-closes-on"
          hint="Энэ өдрийн төгсгөлд сайтаас автоматаар нуугдана. Хоосон бол «Байнга авна»"
          error={errors.closesOn?.message}
        >
          <Input
            id="job-closes-on"
            type="date"
            className="w-fit"
            aria-invalid={Boolean(errors.closesOn)}
            {...register("closesOn")}
          />
        </FormField>
      </div>

      <Controller
        control={control}
        name="isPublished"
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Switch
              id="job-published"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="job-published">Сайт дээр нийтлэх</Label>
          </div>
        )}
      />

      <SaveBar
        isNew={job === null}
        isDirty={isDirty}
        isPending={isPending}
        createLabel="Ажлын байр үүсгэх"
      />
    </form>
  );
}
