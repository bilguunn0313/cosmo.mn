"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateSectionInput } from "@cosmo/shared";
import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/form-field";
import { LinkPicker } from "@/components/admin/link-picker";
import { MediaField } from "@/components/admin/media/media-field";
import { RichTextEditor } from "@/components/admin/rich-text/rich-text-editor";
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
import { ApiError } from "@/lib/api";
import {
  htmlToPlainText,
  isHtmlEmpty,
  plainTextToHtml,
} from "@/lib/plain-text";
import { useSaveSection, type SectionsSource } from "@/lib/queries/sections";
import { isValidLink, toStoredLink } from "@/lib/site-links";
import {
  emptyTranslations,
  formToTranslations,
  translationsToForm,
} from "@/lib/translations";
import type { Locale, Media, Section } from "@/lib/types";

export type SectionBodyMode = "plain" | "rich";

type SectionTranslationValues = {
  title: string;
  body: string;
};

const EMPTY_TRANSLATION: SectionTranslationValues = { title: "", body: "" };

function isBodyEmpty(body: string, bodyMode: SectionBodyMode) {
  return bodyMode === "rich" ? isHtmlEmpty(body) : body.trim() === "";
}

function isFilled(values: SectionTranslationValues, bodyMode: SectionBodyMode) {
  return values.title.trim() !== "" || !isBodyEmpty(values.body, bodyMode);
}

function buildSchema(bodyMode: SectionBodyMode) {
  const translation = z.object({
    title: z.string().trim().max(200),
    body: z.string().max(bodyMode === "rich" ? 50000 : 5000),
  });

  return z.object({
    image: z.custom<Media | null>(),
    linkUrl: z
      .string()
      .trim()
      .max(500)
      .refine(isValidLink, "https://-ээр эхэлсэн бүтэн хаяг оруулна уу"),
    isVisible: z.boolean(),
    translations: z
      .object({ mn: translation, en: translation, zh: translation })
      .superRefine((translations, context) => {
        for (const locale of ["mn", "en", "zh"] as const) {
          const values = translations[locale];
          const isRequired = locale === "mn" || isFilled(values, bodyMode);

          if (!isRequired) {
            continue;
          }

          if (values.title.trim() === "") {
            context.addIssue({
              code: "custom",
              path: [locale, "title"],
              message: locale === "mn" ? "Гарчиг заавал" : "Гарчиг бичнэ үү",
            });
          }

          if (isBodyEmpty(values.body, bodyMode)) {
            context.addIssue({
              code: "custom",
              path: [locale, "body"],
              message: locale === "mn" ? "Текст заавал" : "Текст бичнэ үү",
            });
          }
        }
      }),
  });
}

type SectionFormValues = z.infer<ReturnType<typeof buildSchema>>;

function defaultValues(
  section: Section | null,
  bodyMode: SectionBodyMode,
): SectionFormValues {
  if (!section) {
    return {
      image: null,
      linkUrl: "",
      isVisible: true,
      translations: emptyTranslations(EMPTY_TRANSLATION),
    };
  }

  const translations = section.translations.map((translation) => ({
    ...translation,
    body:
      bodyMode === "rich"
        ? translation.body
        : htmlToPlainText(translation.body),
  }));

  return {
    image: section.image,
    linkUrl: section.linkUrl ?? "",
    isVisible: section.isVisible,
    translations: translationsToForm(translations, EMPTY_TRANSLATION),
  };
}

function toBodyHtml(body: string, bodyMode: SectionBodyMode) {
  if (isBodyEmpty(body, bodyMode)) {
    return "";
  }

  return bodyMode === "rich" ? body : plainTextToHtml(body);
}

function toInput(
  values: SectionFormValues,
  bodyMode: SectionBodyMode,
): UpdateSectionInput {
  const withHtmlBodies = {} as Record<Locale, SectionTranslationValues>;

  for (const locale of ["mn", "en", "zh"] as const) {
    const translation = values.translations[locale];
    withHtmlBodies[locale] = {
      title: translation.title,
      body: toBodyHtml(translation.body, bodyMode),
    };
  }

  return {
    imageId: values.image?.id ?? null,
    linkUrl: toStoredLink(values.linkUrl),
    isVisible: values.isVisible,
    translations: formToTranslations(
      withHtmlBodies,
    ) as UpdateSectionInput["translations"],
  };
}

interface SectionFormProps {
  source: SectionsSource;
  section: Section | null;
  showLink: boolean;
  bodyMode: SectionBodyMode;
  onDone: () => void;
}

function SectionForm({
  source,
  section,
  showLink,
  bodyMode,
  onDone,
}: SectionFormProps) {
  const saveSection = useSaveSection(source);
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(buildSchema(bodyMode)),
    defaultValues: defaultValues(section, bodyMode),
  });

  const translations = useWatch({ control, name: "translations" });

  const onSubmit = handleSubmit((values) => {
    saveSection.mutate(
      { id: section?.id, input: toInput(values, bodyMode) },
      {
        onSuccess: () => {
          toast.success(section ? "Хэсэг хадгалагдлаа" : "Хэсэг нэмэгдлээ");
          onDone();
        },
        onError: (error) => {
          const linkError =
            error instanceof ApiError
              ? error.fieldErrors.linkUrl?.[0]
              : undefined;

          if (linkError) {
            setError("linkUrl", { message: linkError });
          }

          toast.error(error.message);
        },
      },
    );
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <FormField
        label="Зураг"
        htmlFor="section-image"
        hint="Заавал биш. Хэвтээ, 1600×1000 орчим харьцаатай зураг тохиромжтой"
      >
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <MediaField
              value={field.value}
              onChange={field.onChange}
              removable
            />
          )}
        />
      </FormField>

      <TranslationTabs
        hasError={(locale) => Boolean(errors.translations?.[locale])}
        isFilled={(locale) => isFilled(translations[locale], bodyMode)}
      >
        {(locale) => (
          <>
            <FormField
              label="Гарчиг"
              htmlFor={`section-title-${locale}`}
              required={locale === "mn"}
              error={errors.translations?.[locale]?.title?.message}
            >
              <Input
                id={`section-title-${locale}`}
                aria-invalid={Boolean(errors.translations?.[locale]?.title)}
                {...register(`translations.${locale}.title`)}
              />
            </FormField>
            <FormField
              label="Текст"
              htmlFor={`section-body-${locale}`}
              required={locale === "mn"}
              hint={
                bodyMode === "plain"
                  ? "Хоосон мөрөөр догол мөрийг тусгаарлана"
                  : undefined
              }
              error={errors.translations?.[locale]?.body?.message}
            >
              {bodyMode === "rich" ? (
                <Controller
                  control={control}
                  name={`translations.${locale}.body`}
                  render={({ field }) => (
                    <RichTextEditor
                      id={`section-body-${locale}`}
                      value={field.value}
                      onChange={field.onChange}
                      invalid={Boolean(errors.translations?.[locale]?.body)}
                    />
                  )}
                />
              ) : (
                <Textarea
                  id={`section-body-${locale}`}
                  rows={5}
                  aria-invalid={Boolean(errors.translations?.[locale]?.body)}
                  {...register(`translations.${locale}.body`)}
                />
              )}
            </FormField>
          </>
        )}
      </TranslationTabs>

      {showLink && (
        <FormField
          label="«Цааш үзэх» товч дарахад очих хуудас"
          htmlFor="section-link"
          hint="Зочин аль хэлээр үзэж байгаагаас хамаарч тухайн хэлний хуудас руу очно"
          error={errors.linkUrl?.message}
        >
          <Controller
            control={control}
            name="linkUrl"
            render={({ field }) => (
              <LinkPicker
                id="section-link"
                value={field.value}
                onChange={field.onChange}
                invalid={Boolean(errors.linkUrl)}
              />
            )}
          />
        </FormField>
      )}

      <Controller
        control={control}
        name="isVisible"
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Switch
              id="section-visible"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="section-visible">Сайт дээр харуулах</Label>
          </div>
        )}
      />

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onDone}>
          Болих
        </Button>
        <Button type="submit" disabled={saveSection.isPending}>
          {saveSection.isPending && <Loader2 className="animate-spin" />}
          Хадгалах
        </Button>
      </DialogFooter>
    </form>
  );
}

interface SectionFormDialogProps {
  source: SectionsSource;
  section: Section | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showLink?: boolean;
  bodyMode?: SectionBodyMode;
}

export function SectionFormDialog({
  source,
  section,
  open,
  onOpenChange,
  showLink = false,
  bodyMode = "plain",
}: SectionFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{section ? "Хэсэг засах" : "Шинэ хэсэг"}</DialogTitle>
        </DialogHeader>
        {open && (
          <SectionForm
            key={section?.id ?? "new"}
            source={source}
            section={section}
            showLink={showLink}
            bodyMode={bodyMode}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
