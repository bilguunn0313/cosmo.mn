"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/form-field";
import { PanelHeader } from "@/components/admin/panel-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrands } from "@/lib/queries/brands";
import {
  useSiteSetting,
  useUpdateSiteSetting,
} from "@/lib/queries/site-settings";
import type { SiteSetting } from "@/lib/types";

const CURRENT_YEAR = new Date().getFullYear();

const wholeNumber = z
  .string()
  .trim()
  .regex(/^\d*$/, "Зөвхөн бүхэл тоо оруулна уу");

const statsFormSchema = z.object({
  foundedYear: wholeNumber.refine(
    (value) =>
      value === "" || (Number(value) >= 1900 && Number(value) <= CURRENT_YEAR),
    `1900-${CURRENT_YEAR} оны хооронд байх ёстой`,
  ),
  employeeCount: wholeNumber,
  partnerCount: wholeNumber,
});

type StatsFormValues = z.infer<typeof statsFormSchema>;

function toFormValue(value: number | null) {
  return value === null ? "" : String(value);
}

function toNumberOrNull(value: string) {
  return value === "" ? null : Number(value);
}

function defaultValues(setting: SiteSetting): StatsFormValues {
  return {
    foundedYear: toFormValue(setting.foundedYear),
    employeeCount: toFormValue(setting.employeeCount),
    partnerCount: toFormValue(setting.partnerCount),
  };
}

function StatsForm({ setting }: { setting: SiteSetting }) {
  const updateSiteSetting = useUpdateSiteSetting();
  const brands = useBrands();
  const publishedBrandCount =
    brands.data?.filter((brand) => brand.isPublished).length ?? 0;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<StatsFormValues>({
    resolver: zodResolver(statsFormSchema),
    defaultValues: defaultValues(setting),
  });

  const foundedYear = useWatch({ control, name: "foundedYear" });
  const yearsInBusiness =
    foundedYear.length === 4 ? CURRENT_YEAR - Number(foundedYear) : null;

  const onSubmit = handleSubmit((values) => {
    updateSiteSetting.mutate(
      {
        foundedYear: toNumberOrNull(values.foundedYear),
        employeeCount: toNumberOrNull(values.employeeCount),
        partnerCount: toNumberOrNull(values.partnerCount),
      },
      {
        onSuccess: (savedSetting) => {
          reset(defaultValues(savedSetting));
          toast.success("Тоон үзүүлэлт хадгалагдлаа");
        },
        onError: (error) => toast.error(error.message),
      },
    );
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid max-w-3xl gap-6">
      <div className="grid gap-6 sm:grid-cols-3">
        <FormField
          label="Байгуулагдсан он"
          htmlFor="stat-founded-year"
          hint={
            yearsInBusiness !== null && yearsInBusiness >= 0
              ? `Сайт дээр: ${yearsInBusiness}+ жил. Жил бүр өөрөө нэмэгдэнэ`
              : "Жилийн тоо автоматаар бодогдоно"
          }
          error={errors.foundedYear?.message}
        >
          <Input
            id="stat-founded-year"
            inputMode="numeric"
            placeholder="2008"
            aria-invalid={Boolean(errors.foundedYear)}
            {...register("foundedYear")}
          />
        </FormField>
        <FormField
          label="Хамт олон"
          htmlFor="stat-employees"
          hint="Ажилтны тоо"
          error={errors.employeeCount?.message}
        >
          <Input
            id="stat-employees"
            inputMode="numeric"
            placeholder="350"
            aria-invalid={Boolean(errors.employeeCount)}
            {...register("employeeCount")}
          />
        </FormField>
        <FormField
          label="Харилцагч"
          htmlFor="stat-partners"
          hint="Хамтран ажилладаг байгууллага, дэлгүүрийн тоо"
          error={errors.partnerCount?.message}
        >
          <Input
            id="stat-partners"
            inputMode="numeric"
            placeholder="2500"
            aria-invalid={Boolean(errors.partnerCount)}
            {...register("partnerCount")}
          />
        </FormField>
      </div>

      <p className="text-sm text-muted-foreground">
        Брэндийн тоог нийтлэгдсэн брэндүүдээс автоматаар тоолно. Одоо:{" "}
        <span className="font-medium text-foreground tabular-nums">
          {publishedBrandCount}
        </span>
        . Хоосон үлдээсэн үзүүлэлт сайт дээр харагдахгүй.
      </p>

      <Button
        type="submit"
        className="w-fit"
        disabled={!isDirty || updateSiteSetting.isPending}
      >
        {updateSiteSetting.isPending && <Loader2 className="animate-spin" />}
        Хадгалах
      </Button>
    </form>
  );
}

interface StatsPanelProps {
  step: number;
}

export function StatsPanel({ step }: StatsPanelProps) {
  const setting = useSiteSetting();

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={step}
        title="Тоон үзүүлэлт"
        description="Брэндийн туузны доор 4 том тоогоор харагдана. Зочин хэсэг рүү гүйлгэхэд 0-ээс тоологдож гарна."
      />
      {setting.data ? (
        <StatsForm setting={setting.data} />
      ) : (
        <Skeleton className="h-40 max-w-3xl rounded-xl" />
      )}
    </section>
  );
}
