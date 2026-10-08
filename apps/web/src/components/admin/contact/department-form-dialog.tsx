"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateContactDepartmentInput } from "@cosmo/shared";
import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/form-field";
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
import { useSaveDepartment } from "@/lib/queries/contact-departments";
import {
  emptyTranslations,
  formToTranslations,
  isTranslationFilled,
  translationsToForm,
} from "@/lib/translations";
import type { ContactDepartment } from "@/lib/types";

type DepartmentTranslationValues = {
  name: string;
};

const EMPTY_TRANSLATION: DepartmentTranslationValues = { name: "" };

const translationSchema = z.object({ name: z.string().trim().max(100) });

const departmentFormSchema = z.object({
  email: z.email("Имэйл хаяг буруу байна"),
  isActive: z.boolean(),
  translations: z
    .object({
      mn: translationSchema,
      en: translationSchema,
      zh: translationSchema,
    })
    .superRefine((translations, context) => {
      if (translations.mn.name.trim() === "") {
        context.addIssue({
          code: "custom",
          path: ["mn", "name"],
          message: "Нэр заавал",
        });
      }
    }),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

function defaultValues(
  department: ContactDepartment | null,
): DepartmentFormValues {
  if (!department) {
    return {
      email: "",
      isActive: true,
      translations: emptyTranslations(EMPTY_TRANSLATION),
    };
  }

  return {
    email: department.email,
    isActive: department.isActive,
    translations: translationsToForm(
      department.translations,
      EMPTY_TRANSLATION,
    ),
  };
}

function toInput(values: DepartmentFormValues): CreateContactDepartmentInput {
  return {
    email: values.email,
    isActive: values.isActive,
    translations: formToTranslations(
      values.translations,
    ) as CreateContactDepartmentInput["translations"],
  };
}

interface DepartmentFormProps {
  department: ContactDepartment | null;
  onDone: () => void;
}

function DepartmentForm({ department, onDone }: DepartmentFormProps) {
  const saveDepartment = useSaveDepartment();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: defaultValues(department),
  });

  const translations = useWatch({ control, name: "translations" });

  const onSubmit = handleSubmit((values) => {
    saveDepartment.mutate(
      { id: department?.id, input: toInput(values) },
      {
        onSuccess: () => {
          toast.success(department ? "Алба хадгалагдлаа" : "Алба нэмэгдлээ");
          onDone();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <TranslationTabs
        hasError={(locale) => Boolean(errors.translations?.[locale])}
        isFilled={(locale) => isTranslationFilled(translations[locale])}
      >
        {(locale) => (
          <FormField
            label="Албаны нэр"
            htmlFor={`department-name-${locale}`}
            required={locale === "mn"}
            hint={
              locale === "mn"
                ? "Зочин формоос сонгох нэр. Жишээ нь: Хүний нөөц, Худалдаа"
                : undefined
            }
            error={errors.translations?.[locale]?.name?.message}
          >
            <Input
              id={`department-name-${locale}`}
              aria-invalid={Boolean(errors.translations?.[locale]?.name)}
              {...register(`translations.${locale}.name`)}
            />
          </FormField>
        )}
      </TranslationTabs>

      <FormField
        label="Имэйл"
        htmlFor="department-email"
        required
        hint="Энэ албыг сонгож бичсэн захидал энэ хаяг руу очно. Сайт дээр харагдахгүй"
        error={errors.email?.message}
      >
        <Input
          id="department-email"
          type="email"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </FormField>

      <Controller
        control={control}
        name="isActive"
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Switch
              id="department-active"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="department-active">Формд харуулах</Label>
          </div>
        )}
      />

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onDone}>
          Болих
        </Button>
        <Button type="submit" disabled={saveDepartment.isPending}>
          {saveDepartment.isPending && <Loader2 className="animate-spin" />}
          Хадгалах
        </Button>
      </DialogFooter>
    </form>
  );
}

interface DepartmentFormDialogProps {
  department: ContactDepartment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepartmentFormDialog({
  department,
  open,
  onOpenChange,
}: DepartmentFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{department ? "Алба засах" : "Шинэ алба"}</DialogTitle>
        </DialogHeader>
        {open && (
          <DepartmentForm
            key={department?.id ?? "new"}
            department={department}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
