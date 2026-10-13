"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateMilestoneInput } from "@cosmo/shared";
import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/form-field";
import { MediaField } from "@/components/admin/media/media-field";
import { TranslationTabs } from "@/components/admin/translation-tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useSaveMilestone } from "@/lib/queries/milestones";
import {
  emptyTranslations,
  formToTranslations,
  isTranslationFilled,
  translationsToForm,
} from "@/lib/translations";
import type { Media, Milestone } from "@/lib/types";

type MilestoneTranslationValues = {
  title: string;
  description: string;
};

const EMPTY_TRANSLATION: MilestoneTranslationValues = {
  title: "",
  description: "",
};

const translationSchema = z.object({
  title: z.string().trim().max(200),
  description: z.string().trim().max(1000, "1000 тэмдэгтээс ихгүй"),
});

const milestoneFormSchema = z.object({
  year: z.coerce
    .number<string>({ error: "Он бичнэ үү" })
    .int("Он бүхэл тоо байна")
    .min(1900, "1900-аас хойших он")
    .max(2100, "2100-аас өмнөх он"),
  image: z.custom<Media | null>(),
  isVisible: z.boolean(),
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
            message: locale === "mn" ? "Гарчиг заавал" : "Гарчиг бичнэ үү",
          });
        }
      }
    }),
});

type MilestoneFormInput = z.input<typeof milestoneFormSchema>;
type MilestoneFormValues = z.output<typeof milestoneFormSchema>;

function defaultValues(milestone: Milestone | null): MilestoneFormInput {
  if (!milestone) {
    return {
      year: "",
      image: null,
      isVisible: true,
      translations: emptyTranslations(EMPTY_TRANSLATION),
    };
  }

  return {
    year: String(milestone.year),
    image: milestone.image,
    isVisible: milestone.isVisible,
    translations: translationsToForm(milestone.translations, EMPTY_TRANSLATION),
  };
}

function toInput(values: MilestoneFormValues): CreateMilestoneInput {
  return {
    year: values.year,
    imageId: values.image?.id ?? null,
    isVisible: values.isVisible,
    translations: formToTranslations(
      values.translations,
    ) as CreateMilestoneInput["translations"],
  };
}

interface MilestoneFormProps {
  milestone: Milestone | null;
  onDone: () => void;
}

function MilestoneForm({ milestone, onDone }: MilestoneFormProps) {
  const saveMilestone = useSaveMilestone();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MilestoneFormInput, unknown, MilestoneFormValues>({
    resolver: zodResolver(milestoneFormSchema),
    defaultValues: defaultValues(milestone),
  });

  const translations = useWatch({ control, name: "translations" });

  const onSubmit = handleSubmit((values) => {
    saveMilestone.mutate(
      { id: milestone?.id, input: toInput(values) },
      {
        onSuccess: () => {
          toast.success(
            milestone ? "Үйл явдал хадгалагдлаа" : "Үйл явдал нэмэгдлээ",
          );
          onDone();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <FormField
        label="Он"
        htmlFor="milestone-year"
        required
        hint="Жагсаалт оноор автоматаар эрэмбэлэгдэнэ"
        error={errors.year?.message}
      >
        <Input
          id="milestone-year"
          inputMode="numeric"
          placeholder="1996"
          className="max-w-32"
          aria-invalid={Boolean(errors.year)}
          {...register("year")}
        />
      </FormField>

      <TranslationTabs
        hasError={(locale) => Boolean(errors.translations?.[locale])}
        isFilled={(locale) => isTranslationFilled(translations[locale])}
      >
        {(locale) => (
          <>
            <FormField
              label="Гарчиг"
              htmlFor={`milestone-title-${locale}`}
              required={locale === "mn"}
              hint={
                locale === "mn"
                  ? "Жишээ нь: Компани байгуулагдав, Шинэ агуулахаа ашиглалтад орууллаа"
                  : undefined
              }
              error={errors.translations?.[locale]?.title?.message}
            >
              <Input
                id={`milestone-title-${locale}`}
                aria-invalid={Boolean(errors.translations?.[locale]?.title)}
                {...register(`translations.${locale}.title`)}
              />
            </FormField>
            <FormField
              label="Тайлбар"
              htmlFor={`milestone-description-${locale}`}
              hint="Заавал биш. 1–3 өгүүлбэр"
              error={errors.translations?.[locale]?.description?.message}
            >
              <Textarea
                id={`milestone-description-${locale}`}
                rows={3}
                aria-invalid={Boolean(
                  errors.translations?.[locale]?.description,
                )}
                {...register(`translations.${locale}.description`)}
              />
            </FormField>
          </>
        )}
      </TranslationTabs>

      <FormField
        label="Зураг"
        htmlFor="milestone-image"
        hint="Заавал биш. Тухайн үеийн зураг байвал түүх илүү амьд харагдана"
      >
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <MediaField
              value={field.value ?? null}
              onChange={field.onChange}
              removable
            />
          )}
        />
      </FormField>

      <Controller
        control={control}
        name="isVisible"
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Switch
              id="milestone-visible"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="milestone-visible">Сайт дээр харуулах</Label>
          </div>
        )}
      />

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onDone}>
          Болих
        </Button>
        <Button type="submit" disabled={saveMilestone.isPending}>
          {saveMilestone.isPending && <Loader2 className="animate-spin" />}
          Хадгалах
        </Button>
      </DialogFooter>
    </form>
  );
}

interface MilestoneFormDialogProps {
  milestone: Milestone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MilestoneFormDialog({
  milestone,
  open,
  onOpenChange,
}: MilestoneFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {milestone ? "Үйл явдал засах" : "Шинэ үйл явдал"}
          </DialogTitle>
        </DialogHeader>
        {open && (
          <MilestoneForm
            key={milestone?.id ?? "new"}
            milestone={milestone}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
