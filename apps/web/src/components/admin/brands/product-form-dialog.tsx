"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateProductInput } from "@cosmo/shared";
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
import { useSaveProduct } from "@/lib/queries/brand-products";
import {
  emptyTranslations,
  formToTranslations,
  isTranslationFilled,
  translationsToForm,
} from "@/lib/translations";
import type { Media, Product } from "@/lib/types";

type ProductTranslationValues = {
  name: string;
  description: string;
};

const EMPTY_TRANSLATION: ProductTranslationValues = {
  name: "",
  description: "",
};

const translationSchema = z.object({
  name: z.string().trim().max(200),
  description: z.string().trim().max(1000),
});

const productFormSchema = z.object({
  image: z
    .custom<Media | null>()
    .refine((image) => image !== null, "Зураг заавал сонгоно уу"),
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

type ProductFormInput = z.input<typeof productFormSchema>;
type ProductFormValues = z.output<typeof productFormSchema>;

function defaultValues(product: Product | null): ProductFormInput {
  if (!product) {
    return {
      image: null,
      isVisible: true,
      translations: emptyTranslations(EMPTY_TRANSLATION),
    };
  }

  return {
    image: product.image,
    isVisible: product.isVisible,
    translations: translationsToForm(product.translations, EMPTY_TRANSLATION),
  };
}

function toInput(values: ProductFormValues): CreateProductInput {
  return {
    imageId: values.image!.id,
    isVisible: values.isVisible,
    translations: formToTranslations(
      values.translations,
    ) as CreateProductInput["translations"],
  };
}

interface ProductFormProps {
  brandId: number;
  product: Product | null;
  onDone: () => void;
}

function ProductForm({ brandId, product, onDone }: ProductFormProps) {
  const saveProduct = useSaveProduct(brandId);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues(product),
  });

  const translations = useWatch({ control, name: "translations" });

  const onSubmit = handleSubmit((values) => {
    saveProduct.mutate(
      { id: product?.id, input: toInput(values) },
      {
        onSuccess: () => {
          toast.success(
            product ? "Бүтээгдэхүүн хадгалагдлаа" : "Бүтээгдэхүүн нэмэгдлээ",
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
        label="Зураг"
        htmlFor="product-image"
        required
        hint="Цагаан эсвэл тунгалаг дэвсгэртэй, дөрвөлжин зураг тохиромжтой"
        error={errors.image?.message}
      >
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <MediaField
              value={field.value}
              onChange={field.onChange}
              invalid={Boolean(errors.image)}
            />
          )}
        />
      </FormField>

      <TranslationTabs
        hasError={(locale) => Boolean(errors.translations?.[locale])}
        isFilled={(locale) => isTranslationFilled(translations[locale])}
      >
        {(locale) => (
          <>
            <FormField
              label="Нэр"
              htmlFor={`product-name-${locale}`}
              required={locale === "mn"}
              error={errors.translations?.[locale]?.name?.message}
            >
              <Input
                id={`product-name-${locale}`}
                aria-invalid={Boolean(errors.translations?.[locale]?.name)}
                {...register(`translations.${locale}.name`)}
              />
            </FormField>
            <FormField
              label="Товч тайлбар"
              htmlFor={`product-description-${locale}`}
              hint="Заавал биш. 1–2 өгүүлбэр"
              error={errors.translations?.[locale]?.description?.message}
            >
              <Textarea
                id={`product-description-${locale}`}
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

      <Controller
        control={control}
        name="isVisible"
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Switch
              id="product-visible"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="product-visible">Сайт дээр харуулах</Label>
          </div>
        )}
      />

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onDone}>
          Болих
        </Button>
        <Button type="submit" disabled={saveProduct.isPending}>
          {saveProduct.isPending && <Loader2 className="animate-spin" />}
          Хадгалах
        </Button>
      </DialogFooter>
    </form>
  );
}

interface ProductFormDialogProps {
  brandId: number;
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductFormDialog({
  brandId,
  product,
  open,
  onOpenChange,
}: ProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн"}
          </DialogTitle>
        </DialogHeader>
        {open && (
          <ProductForm
            key={product?.id ?? "new"}
            brandId={brandId}
            product={product}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
