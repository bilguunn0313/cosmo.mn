"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateRetailPartnerInput } from "@cosmo/shared";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/form-field";
import { MediaField } from "@/components/admin/media/media-field";
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
import { useSaveRetailPartner } from "@/lib/queries/retail-partners";
import type { Media, RetailPartner } from "@/lib/types";

const retailPartnerFormSchema = z.object({
  name: z.string().trim().min(1, "Нэр заавал").max(100),
  logo: z
    .custom<Media | null>()
    .refine((logo) => logo !== null, "Лого сонгоно уу"),
  isVisible: z.boolean(),
});

type RetailPartnerFormInput = z.input<typeof retailPartnerFormSchema>;
type RetailPartnerFormValues = z.output<typeof retailPartnerFormSchema>;

function defaultValues(partner: RetailPartner | null): RetailPartnerFormInput {
  return {
    name: partner?.name ?? "",
    logo: partner?.logo ?? null,
    isVisible: partner?.isVisible ?? true,
  };
}

function toInput(values: RetailPartnerFormValues): CreateRetailPartnerInput {
  return {
    name: values.name,
    logoId: values.logo.id,
    isVisible: values.isVisible,
  };
}

interface RetailPartnerFormProps {
  partner: RetailPartner | null;
  onDone: () => void;
}

function RetailPartnerForm({ partner, onDone }: RetailPartnerFormProps) {
  const savePartner = useSaveRetailPartner();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RetailPartnerFormInput, unknown, RetailPartnerFormValues>({
    resolver: zodResolver(retailPartnerFormSchema),
    defaultValues: defaultValues(partner),
  });

  const onSubmit = handleSubmit((values) => {
    savePartner.mutate(
      { id: partner?.id, input: toInput(values) },
      {
        onSuccess: () => {
          toast.success(
            partner ? "Харилцагч хадгалагдлаа" : "Харилцагч нэмэгдлээ",
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
        label="Лого"
        htmlFor="retail-partner-logo"
        required
        error={errors.logo?.message}
        hint="Тунгалаг дэвсгэртэй PNG эсвэл цагаан дэвсгэртэй зураг. Цагаан дөрвөлжин дотор голлож харагдана"
      >
        <Controller
          control={control}
          name="logo"
          render={({ field }) => (
            <MediaField
              value={field.value}
              onChange={field.onChange}
              pickerTitle="Лого сонгох"
              invalid={Boolean(errors.logo)}
            />
          )}
        />
      </FormField>

      <FormField
        label="Нэр"
        htmlFor="retail-partner-name"
        required
        error={errors.name?.message}
        hint="Сайт дээр харагдахгүй, лого уншдаггүй хүмүүст зориулж ашиглана. Жишээ нь «Номин супермаркет»"
      >
        <Input
          id="retail-partner-name"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
      </FormField>

      <Controller
        control={control}
        name="isVisible"
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Switch
              id="retail-partner-visible"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="retail-partner-visible">Сайт дээр харуулах</Label>
          </div>
        )}
      />

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onDone}>
          Болих
        </Button>
        <Button type="submit" disabled={savePartner.isPending}>
          {savePartner.isPending && <Loader2 className="animate-spin" />}
          Хадгалах
        </Button>
      </DialogFooter>
    </form>
  );
}

interface RetailPartnerFormDialogProps {
  partner: RetailPartner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RetailPartnerFormDialog({
  partner,
  open,
  onOpenChange,
}: RetailPartnerFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {partner ? "Харилцагч засах" : "Шинэ харилцагч"}
          </DialogTitle>
        </DialogHeader>
        {open && (
          <RetailPartnerForm
            key={partner?.id ?? "new"}
            partner={partner}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
