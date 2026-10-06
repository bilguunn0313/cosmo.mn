"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BRAND_CATEGORIES,
  slugify,
  slugSchema,
  type CreateBrandInput,
} from "@cosmo/shared";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/form-field";
import { MediaField } from "@/components/admin/media/media-field";
import { TranslationTabs } from "@/components/admin/translation-tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import { BRAND_CATEGORY_LABELS } from "@/lib/brand-categories";
import { useCreateBrand, useUpdateBrand } from "@/lib/queries/brands";
import { isExternalUrl, isValidLink } from "@/lib/site-links";
import {
  emptyTranslations,
  formToTranslations,
  isTranslationFilled,
  translationsToForm,
} from "@/lib/translations";
import type { Brand, BrandCategory, Media } from "@/lib/types";

type BrandTranslationValues = {
  name: string;
  summary: string;
};

const EMPTY_TRANSLATION: BrandTranslationValues = { name: "", summary: "" };

const translationSchema = z.object({
  name: z.string().trim().max(200),
  summary: z.string().trim().max(1000),
});

function isValidWebsite(value: string) {
  return value === "" || (isExternalUrl(value) && isValidLink(value));
}

const brandFormSchema = z.object({
  slug: slugSchema,
  categories: z
    .array(z.enum(BRAND_CATEGORIES))
    .min(1, "Дор хаяж нэг ангилал сонгоно уу"),
  logo: z.custom<Media | null>(),
  cover: z.custom<Media | null>(),
  websiteUrl: z
    .string()
    .trim()
    .max(500)
    .refine(isValidWebsite, "https://-ээр эхэлсэн бүтэн хаяг оруулна уу"),
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

        if (isRequired && values.name.trim() === "") {
          context.addIssue({
            code: "custom",
            path: [locale, "name"],
            message: locale === "mn" ? "Нэр заавал" : "Нэр бичнэ үү",
          });
        }
      }
    }),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

function defaultValues(brand: Brand | null): BrandFormValues {
  if (!brand) {
    return {
      slug: "",
      categories: [],
      logo: null,
      cover: null,
      websiteUrl: "",
      isPublished: false,
      translations: emptyTranslations(EMPTY_TRANSLATION),
    };
  }

  return {
    slug: brand.slug,
    categories: brand.categories,
    logo: brand.logo,
    cover: brand.cover,
    websiteUrl: brand.websiteUrl ?? "",
    isPublished: brand.isPublished,
    translations: translationsToForm(brand.translations, EMPTY_TRANSLATION),
  };
}

function toInput(values: BrandFormValues): CreateBrandInput {
  return {
    slug: values.slug,
    categories: values.categories,
    logoId: values.logo?.id ?? null,
    coverId: values.cover?.id ?? null,
    websiteUrl: values.websiteUrl === "" ? null : values.websiteUrl,
    isPublished: values.isPublished,
    translations: formToTranslations(
      values.translations,
    ) as CreateBrandInput["translations"],
  };
}

function toggleCategory(
  categories: BrandCategory[],
  category: BrandCategory,
  checked: boolean,
) {
  const next = checked
    ? [...categories, category]
    : categories.filter((item) => item !== category);

  return BRAND_CATEGORIES.filter((item) => next.includes(item));
}

interface BrandFormProps {
  brand: Brand | null;
  onCreated?: (brand: Brand) => void;
}

export function BrandForm({ brand, onCreated }: BrandFormProps) {
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const isPending = createBrand.isPending || updateBrand.isPending;
  const [isSlugEdited, setIsSlugEdited] = useState(brand !== null);
  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: defaultValues(brand),
  });

  const translations = useWatch({ control, name: "translations" });
  const slug = useWatch({ control, name: "slug" });

  const onError = (error: Error) => {
    if (error instanceof ApiError && error.status === 409) {
      setError("slug", { message: "Энэ хаяг өөр брэндэд ашиглагдсан байна" });
    }

    toast.error(error.message);
  };

  const submit = handleSubmit((values) => {
    const input = toInput(values);

    if (brand) {
      updateBrand.mutate(
        { id: brand.id, input },
        { onSuccess: () => toast.success("Брэнд хадгалагдлаа"), onError },
      );
      return;
    }

    createBrand.mutate(input, {
      onSuccess: (createdBrand) => {
        toast.success("Брэнд үүслээ. Одоо бүтээгдэхүүн, хэсгүүдээ нэмнэ үү");
        onCreated?.(createdBrand);
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
              label="Брэндийн нэр"
              htmlFor={`brand-name-${locale}`}
              required={locale === "mn"}
              error={errors.translations?.[locale]?.name?.message}
            >
              <Input
                id={`brand-name-${locale}`}
                aria-invalid={Boolean(errors.translations?.[locale]?.name)}
                {...register(`translations.${locale}.name`, {
                  onChange: (event) => {
                    if (locale === "mn" && !isSlugEdited) {
                      setValue("slug", slugify(event.target.value));
                    }
                  },
                })}
              />
            </FormField>
            <FormField
              label="Товч танилцуулга"
              htmlFor={`brand-summary-${locale}`}
              hint="Брэндүүдийн жагсаалт болон брэндийн хуудасны эхэнд гарна. 1–3 өгүүлбэр"
              error={errors.translations?.[locale]?.summary?.message}
            >
              <Textarea
                id={`brand-summary-${locale}`}
                rows={3}
                aria-invalid={Boolean(errors.translations?.[locale]?.summary)}
                {...register(`translations.${locale}.summary`)}
              />
            </FormField>
          </>
        )}
      </TranslationTabs>

      <FormField
        label="Хуудасны хаяг"
        htmlFor="brand-slug"
        required
        hint={
          brand
            ? "Өөрчилбөл хуучин хаягаар орж ирэх холбоосууд ажиллахаа болино"
            : "Монгол нэрээс автоматаар үүснэ. Хүсвэл өөрчилж болно"
        }
        error={errors.slug?.message}
      >
        <div className="flex items-center overflow-hidden rounded-lg border focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive">
          <span className="shrink-0 border-r bg-muted px-3 py-1.5 text-sm text-muted-foreground">
            cosmo.mn/brands/
          </span>
          <input
            id="brand-slug"
            aria-invalid={Boolean(errors.slug)}
            className="h-8 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
            {...register("slug", { onChange: () => setIsSlugEdited(true) })}
          />
        </div>
      </FormField>

      <FormField
        label="Ангилал"
        htmlFor="brand-category-FOOD"
        required
        hint="Нэг брэнд хэд хэдэн ангилалд багтаж болно"
        error={errors.categories?.message}
      >
        <Controller
          control={control}
          name="categories"
          render={({ field }) => (
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {BRAND_CATEGORIES.map((category) => (
                <div key={category} className="flex items-center gap-2">
                  <Checkbox
                    id={`brand-category-${category}`}
                    checked={field.value.includes(category)}
                    aria-invalid={Boolean(errors.categories)}
                    onCheckedChange={(checked) =>
                      field.onChange(
                        toggleCategory(field.value, category, checked),
                      )
                    }
                  />
                  <Label htmlFor={`brand-category-${category}`}>
                    {BRAND_CATEGORY_LABELS[category]}
                  </Label>
                </div>
              ))}
            </div>
          )}
        />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Лого"
          htmlFor="brand-logo"
          hint="Тунгалаг дэвсгэртэй PNG тохиромжтой"
        >
          <Controller
            control={control}
            name="logo"
            render={({ field }) => (
              <MediaField
                value={field.value}
                onChange={field.onChange}
                pickerTitle="Лого сонгох"
                removable
              />
            )}
          />
        </FormField>
        <FormField
          label="Нүүр зураг"
          htmlFor="brand-cover"
          hint="Брэндийн хуудасны дээд хэсэгт. Хэвтээ, 1920×800 орчим"
        >
          <Controller
            control={control}
            name="cover"
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
      </div>

      <FormField
        label="Брэндийн албан ёсны вэбсайт"
        htmlFor="brand-website"
        hint="Заавал биш. Жишээ нь https://www.nivea.com"
        error={errors.websiteUrl?.message}
      >
        <Input
          id="brand-website"
          type="url"
          placeholder="https://"
          aria-invalid={Boolean(errors.websiteUrl)}
          {...register("websiteUrl")}
        />
      </FormField>

      <Controller
        control={control}
        name="isPublished"
        render={({ field }) => (
          <div className="flex items-start gap-3">
            <Switch
              id="brand-published"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <div className="grid gap-1">
              <Label htmlFor="brand-published">Сайт дээр нийтлэх</Label>
              <p className="text-sm text-muted-foreground">
                Унтраалттай үед ноорог хэвээр үлдэнэ.{" "}
                {slug &&
                  `Нийтэлсний дараа cosmo.mn/brands/${slug} хаягаар харагдана.`}
              </p>
            </div>
          </div>
        )}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {brand ? "Хадгалах" : "Брэнд үүсгэх"}
        </Button>
      </div>
    </form>
  );
}
