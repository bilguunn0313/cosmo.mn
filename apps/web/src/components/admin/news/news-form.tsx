"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { slugify, slugSchema, type CreateNewsInput } from "@cosmo/shared";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/form-field";
import { MediaField } from "@/components/admin/media/media-field";
import { PrefixedInput } from "@/components/admin/prefixed-input";
import { RichTextEditor } from "@/components/admin/rich-text/rich-text-editor";
import { SaveBar } from "@/components/admin/save-bar";
import { TranslationTabs } from "@/components/admin/translation-tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import { fromDateTimeInput, toDateTimeInput } from "@/lib/format";
import { isHtmlEmpty } from "@/lib/plain-text";
import { useCreateNews, useUpdateNews } from "@/lib/queries/news";
import {
  emptyTranslations,
  formToTranslations,
  translationsToForm,
} from "@/lib/translations";
import type { Locale, Media, News } from "@/lib/types";

type NewsTranslationValues = {
  title: string;
  summary: string;
  content: string;
};

const EMPTY_TRANSLATION: NewsTranslationValues = {
  title: "",
  summary: "",
  content: "",
};

const translationSchema = z.object({
  title: z.string().trim().max(300),
  summary: z.string().trim().max(1000),
  content: z.string().max(100000),
});

function isFilled(values: NewsTranslationValues) {
  return (
    values.title.trim() !== "" ||
    values.summary.trim() !== "" ||
    !isHtmlEmpty(values.content)
  );
}

const newsFormSchema = z.object({
  slug: slugSchema,
  coverImage: z.custom<Media | null>(),
  video: z.custom<Media | null>(),
  isPublished: z.boolean(),
  publishedAt: z
    .string()
    .refine(
      (value) => value === "" || !Number.isNaN(Date.parse(value)),
      "Огноо буруу байна",
    ),
  translations: z
    .object({
      mn: translationSchema,
      en: translationSchema,
      zh: translationSchema,
    })
    .superRefine((translations, context) => {
      for (const locale of ["mn", "en", "zh"] as const) {
        const values = translations[locale];
        const isRequired = locale === "mn" || isFilled(values);

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

        if (isHtmlEmpty(values.content)) {
          context.addIssue({
            code: "custom",
            path: [locale, "content"],
            message: locale === "mn" ? "Агуулга заавал" : "Агуулга бичнэ үү",
          });
        }
      }
    }),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

function defaultValues(news: News | null): NewsFormValues {
  if (!news) {
    return {
      slug: "",
      coverImage: null,
      video: null,
      isPublished: false,
      publishedAt: "",
      translations: emptyTranslations(EMPTY_TRANSLATION),
    };
  }

  return {
    slug: news.slug,
    coverImage: news.coverImage,
    video: news.video,
    isPublished: news.isPublished,
    publishedAt: toDateTimeInput(news.publishedAt),
    translations: translationsToForm(news.translations, EMPTY_TRANSLATION),
  };
}

function toInput(values: NewsFormValues): CreateNewsInput {
  const translations = {} as Record<Locale, NewsTranslationValues>;

  for (const locale of ["mn", "en", "zh"] as const) {
    const translation = values.translations[locale];
    translations[locale] = {
      ...translation,
      content: isHtmlEmpty(translation.content) ? "" : translation.content,
    };
  }

  const hasPublishDate = values.isPublished && values.publishedAt !== "";

  return {
    slug: values.slug,
    coverImageId: values.coverImage?.id ?? null,
    videoId: values.video?.id ?? null,
    isPublished: values.isPublished,
    publishedAt: hasPublishDate
      ? fromDateTimeInput(values.publishedAt)
      : undefined,
    translations: formToTranslations(
      translations,
    ) as CreateNewsInput["translations"],
  };
}

interface NewsFormProps {
  news: News | null;
  onCreated?: (news: News) => void;
}

export function NewsForm({ news, onCreated }: NewsFormProps) {
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const isPending = createNews.isPending || updateNews.isPending;
  const [isSlugEdited, setIsSlugEdited] = useState(news !== null);
  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: defaultValues(news),
  });

  const translations = useWatch({ control, name: "translations" });
  const isPublished = useWatch({ control, name: "isPublished" });

  const onError = (error: Error) => {
    if (error instanceof ApiError && error.status === 409) {
      setError("slug", { message: "Энэ хаяг өөр мэдээнд ашиглагдсан байна" });
    }

    toast.error(error.message);
  };

  const submit = handleSubmit((values) => {
    const input = toInput(values);

    if (news) {
      updateNews.mutate(
        { id: news.id, input },
        {
          onSuccess: (savedNews) => {
            reset(defaultValues(savedNews));
            toast.success("Мэдээ хадгалагдлаа");
          },
          onError,
        },
      );
      return;
    }

    createNews.mutate(input, {
      onSuccess: (createdNews) => {
        toast.success(
          createdNews.isPublished ? "Мэдээ нийтлэгдлээ" : "Ноорог хадгалагдлаа",
        );
        onCreated?.(createdNews);
      },
      onError,
    });
  });

  return (
    <form onSubmit={submit} noValidate className="grid max-w-3xl gap-8">
      <TranslationTabs
        hasError={(locale) => Boolean(errors.translations?.[locale])}
        isFilled={(locale) => isFilled(translations[locale])}
      >
        {(locale) => (
          <>
            <FormField
              label="Гарчиг"
              htmlFor={`news-title-${locale}`}
              required={locale === "mn"}
              error={errors.translations?.[locale]?.title?.message}
            >
              <Input
                id={`news-title-${locale}`}
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
            <FormField
              label="Товч агуулга"
              htmlFor={`news-summary-${locale}`}
              hint="Заавал биш. Мэдээний жагсаалт дээр гарчгийн доор 1–2 өгүүлбэрээр харагдана"
              error={errors.translations?.[locale]?.summary?.message}
            >
              <Textarea
                id={`news-summary-${locale}`}
                rows={2}
                aria-invalid={Boolean(errors.translations?.[locale]?.summary)}
                {...register(`translations.${locale}.summary`)}
              />
            </FormField>
            <FormField
              label="Агуулга"
              htmlFor={`news-content-${locale}`}
              required={locale === "mn"}
              error={errors.translations?.[locale]?.content?.message}
            >
              <Controller
                control={control}
                name={`translations.${locale}.content`}
                render={({ field }) => (
                  <RichTextEditor
                    id={`news-content-${locale}`}
                    value={field.value}
                    onChange={field.onChange}
                    invalid={Boolean(errors.translations?.[locale]?.content)}
                  />
                )}
              />
            </FormField>
          </>
        )}
      </TranslationTabs>

      <FormField
        label="Хуудасны хаяг"
        htmlFor="news-slug"
        required
        hint={
          news
            ? "Өөрчилбөл хуучин хаягаар хуваалцсан холбоосууд ажиллахаа болино"
            : "Монгол гарчгаас автоматаар үүснэ. Хүсвэл өөрчилж болно"
        }
        error={errors.slug?.message}
      >
        <PrefixedInput
          id="news-slug"
          prefix="cosmo.mn/media/"
          aria-invalid={Boolean(errors.slug)}
          {...register("slug", { onChange: () => setIsSlugEdited(true) })}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Нүүр зураг"
          htmlFor="news-cover"
          hint="Жагсаалт болон Facebook-т хуваалцахад харагдана. Хэвтээ, 1200×630 орчим"
        >
          <Controller
            control={control}
            name="coverImage"
            render={({ field }) => (
              <MediaField
                value={field.value}
                onChange={field.onChange}
                pickerTitle="Нүүр зураг сонгох"
                removable
              />
            )}
          />
        </FormField>
        <FormField
          label="Видео"
          htmlFor="news-video"
          hint="Заавал биш. Мэдээний эхэнд тоглоно, нүүр зураг нь видеоны эхний дэлгэц болно"
        >
          <Controller
            control={control}
            name="video"
            render={({ field }) => (
              <MediaField
                value={field.value}
                onChange={field.onChange}
                allowedTypes={["VIDEO"]}
                removable
              />
            )}
          />
        </FormField>
      </div>

      <div className="grid gap-4">
        <Controller
          control={control}
          name="isPublished"
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Switch
                id="news-published"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="news-published">Сайт дээр нийтлэх</Label>
            </div>
          )}
        />
        {isPublished && (
          <FormField
            label="Нийтлэх огноо"
            htmlFor="news-published-at"
            hint="Хоосон бол хадгалах үед одоогийн цаг тавигдана. Ирээдүйн огноо сонговол тэр үед автоматаар гарна"
            error={errors.publishedAt?.message}
          >
            <Input
              id="news-published-at"
              type="datetime-local"
              className="w-fit"
              aria-invalid={Boolean(errors.publishedAt)}
              {...register("publishedAt")}
            />
          </FormField>
        )}
      </div>

      <SaveBar
        isNew={news === null}
        isDirty={isDirty}
        isPending={isPending}
        createLabel="Мэдээ үүсгэх"
      />
    </form>
  );
}
