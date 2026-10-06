"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateSlideInput } from "@cosmo/shared";
import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/form-field";
import { LinkPicker } from "@/components/admin/link-picker";
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
import { ApiError } from "@/lib/api";
import { isValidLink, toStoredLink } from "@/lib/site-links";
import { useSaveSlide } from "@/lib/queries/slides";
import {
  emptyTranslations,
  formToTranslations,
  isTranslationFilled,
  translationsToForm,
} from "@/lib/translations";
import type { Media, Slide } from "@/lib/types";

const translationFields = z.object({
  title: z.string().trim().max(200),
  subtitle: z.string().trim().max(300),
  buttonText: z.string().trim().max(50),
});

const slideFormSchema = z.object({
  media: z
    .custom<Media | null>()
    .refine((media) => media !== null, "Видео эсвэл зураг сонгоно уу"),
  poster: z.custom<Media | null>(),
  linkUrl: z
    .string()
    .trim()
    .max(500)
    .refine(isValidLink, "https://-ээр эхэлсэн бүтэн хаяг оруулна уу"),
  isActive: z.boolean(),
  translations: z
    .object({
      mn: translationFields.extend({
        title: z.string().trim().min(1, "Гарчиг заавал").max(200),
      }),
      en: translationFields,
      zh: translationFields,
    })
    .superRefine((translations, context) => {
      for (const locale of ["en", "zh"] as const) {
        const values = translations[locale];

        if (isTranslationFilled(values) && values.title.trim() === "") {
          context.addIssue({
            code: "custom",
            path: [locale, "title"],
            message: "Гарчиг бичнэ үү",
          });
        }
      }
    }),
});

type SlideFormInput = z.input<typeof slideFormSchema>;
type SlideFormValues = z.output<typeof slideFormSchema>;

const EMPTY_TRANSLATION = { title: "", subtitle: "", buttonText: "" };

function defaultValues(slide: Slide | null): SlideFormInput {
  if (!slide) {
    return {
      media: null,
      poster: null,
      linkUrl: "",
      isActive: true,
      translations: emptyTranslations(EMPTY_TRANSLATION),
    };
  }

  return {
    media: slide.media,
    poster: slide.poster,
    linkUrl: slide.linkUrl ?? "",
    isActive: slide.isActive,
    translations: translationsToForm(slide.translations, EMPTY_TRANSLATION),
  };
}

function toInput(values: SlideFormValues): CreateSlideInput {
  return {
    mediaId: values.media.id,
    posterId:
      values.media.type === "VIDEO" ? (values.poster?.id ?? null) : null,
    linkUrl: toStoredLink(values.linkUrl),
    isActive: values.isActive,
    translations: formToTranslations(
      values.translations,
    ) as CreateSlideInput["translations"],
  };
}

interface SlideFormProps {
  slide: Slide | null;
  onDone: () => void;
}

function SlideForm({ slide, onDone }: SlideFormProps) {
  const saveSlide = useSaveSlide();
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SlideFormInput, unknown, SlideFormValues>({
    resolver: zodResolver(slideFormSchema),
    defaultValues: defaultValues(slide),
  });

  const media = useWatch({ control, name: "media" });
  const translations = useWatch({ control, name: "translations" });

  const onSubmit = handleSubmit((values) => {
    saveSlide.mutate(
      { id: slide?.id, input: toInput(values) },
      {
        onSuccess: () => {
          toast.success(slide ? "Слайд хадгалагдлаа" : "Слайд нэмэгдлээ");
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
        label="Видео эсвэл зураг"
        htmlFor="slide-media"
        required
        error={errors.media?.message}
        hint="1920×1080 харьцаатай. Видео нь дуугүй MP4, 20MB хүртэл байвал хурдан ачаална"
      >
        <Controller
          control={control}
          name="media"
          render={({ field }) => (
            <MediaField
              value={field.value}
              onChange={field.onChange}
              allowedTypes={["IMAGE", "VIDEO"]}
              invalid={Boolean(errors.media)}
            />
          )}
        />
      </FormField>

      {media?.type === "VIDEO" && (
        <FormField
          label="Poster зураг"
          htmlFor="slide-poster"
          hint="Видео ачаалагдах хооронд болон интернэт удаан үед харагдана. Видеоны эхний кадрыг зураг болгож оруулахад тохиромжтой"
        >
          <Controller
            control={control}
            name="poster"
            render={({ field }) => (
              <MediaField
                value={field.value}
                onChange={field.onChange}
                pickerTitle="Poster зураг сонгох"
                removable
              />
            )}
          />
        </FormField>
      )}

      <TranslationTabs
        hasError={(locale) => Boolean(errors.translations?.[locale])}
        isFilled={(locale) => isTranslationFilled(translations[locale])}
      >
        {(locale) => (
          <>
            <FormField
              label="Гарчиг"
              htmlFor={`slide-title-${locale}`}
              required={locale === "mn"}
              error={errors.translations?.[locale]?.title?.message}
            >
              <Input
                id={`slide-title-${locale}`}
                aria-invalid={Boolean(errors.translations?.[locale]?.title)}
                {...register(`translations.${locale}.title`)}
              />
            </FormField>
            <FormField
              label="Дэд гарчиг"
              htmlFor={`slide-subtitle-${locale}`}
              error={errors.translations?.[locale]?.subtitle?.message}
            >
              <Input
                id={`slide-subtitle-${locale}`}
                {...register(`translations.${locale}.subtitle`)}
              />
            </FormField>
            <FormField
              label="Товчны текст"
              htmlFor={`slide-button-${locale}`}
              hint="Хоосон бол товч харагдахгүй"
              error={errors.translations?.[locale]?.buttonText?.message}
            >
              <Input
                id={`slide-button-${locale}`}
                placeholder="Дэлгэрэнгүй"
                {...register(`translations.${locale}.buttonText`)}
              />
            </FormField>
          </>
        )}
      </TranslationTabs>

      <FormField
        label="Товч дарахад очих хуудас"
        htmlFor="slide-link"
        hint="Зочин аль хэлээр үзэж байгаагаас хамаарч тухайн хэлний хуудас руу очно"
        error={errors.linkUrl?.message}
      >
        <Controller
          control={control}
          name="linkUrl"
          render={({ field }) => (
            <LinkPicker
              id="slide-link"
              value={field.value}
              onChange={field.onChange}
              invalid={Boolean(errors.linkUrl)}
            />
          )}
        />
      </FormField>

      <Controller
        control={control}
        name="isActive"
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Switch
              id="slide-active"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="slide-active">Сайт дээр харуулах</Label>
          </div>
        )}
      />

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onDone}>
          Болих
        </Button>
        <Button type="submit" disabled={saveSlide.isPending}>
          {saveSlide.isPending && <Loader2 className="animate-spin" />}
          Хадгалах
        </Button>
      </DialogFooter>
    </form>
  );
}

interface SlideFormDialogProps {
  slide: Slide | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SlideFormDialog({
  slide,
  open,
  onOpenChange,
}: SlideFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{slide ? "Слайд засах" : "Шинэ слайд"}</DialogTitle>
        </DialogHeader>
        {open && (
          <SlideForm
            key={slide?.id ?? "new"}
            slide={slide}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
