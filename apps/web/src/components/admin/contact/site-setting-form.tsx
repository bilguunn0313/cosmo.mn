"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateSiteSettingInput } from "@cosmo/shared";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/form-field";
import { MediaField } from "@/components/admin/media/media-field";
import { SaveBar } from "@/components/admin/save-bar";
import { TranslationTabs } from "@/components/admin/translation-tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateSiteSetting } from "@/lib/queries/site-settings";
import { isExternalUrl, isValidLink } from "@/lib/site-links";
import {
  formToTranslations,
  isTranslationFilled,
  translationsToForm,
} from "@/lib/translations";
import type { Media, SiteSetting } from "@/lib/types";

type SettingTranslationValues = {
  address: string;
  workingHours: string;
};

const EMPTY_TRANSLATION: SettingTranslationValues = {
  address: "",
  workingHours: "",
};

const translationSchema = z.object({
  address: z.string().trim().max(500),
  workingHours: z.string().trim().max(200),
});

const urlField = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => value === "" || (isExternalUrl(value) && isValidLink(value)),
    "https://-ээр эхэлсэн бүтэн хаяг оруулна уу",
  );

const siteSettingFormSchema = z.object({
  phone: z.string().trim().max(50),
  email: z.union([z.literal(""), z.email("Имэйл хаяг буруу байна")]),
  mapImage: z.custom<Media | null>(),
  mapUrl: urlField,
  facebookUrl: urlField,
  instagramUrl: urlField,
  youtubeUrl: urlField,
  linkedinUrl: urlField,
  translations: z.object({
    mn: translationSchema,
    en: translationSchema,
    zh: translationSchema,
  }),
});

type SiteSettingFormValues = z.infer<typeof siteSettingFormSchema>;

const SOCIAL_FIELDS = [
  { name: "facebookUrl", label: "Facebook" },
  { name: "instagramUrl", label: "Instagram" },
  { name: "youtubeUrl", label: "YouTube" },
  { name: "linkedinUrl", label: "LinkedIn" },
] as const;

function defaultValues(setting: SiteSetting): SiteSettingFormValues {
  return {
    phone: setting.phone ?? "",
    email: setting.email ?? "",
    mapImage: setting.mapImage,
    mapUrl: setting.mapUrl ?? "",
    facebookUrl: setting.facebookUrl ?? "",
    instagramUrl: setting.instagramUrl ?? "",
    youtubeUrl: setting.youtubeUrl ?? "",
    linkedinUrl: setting.linkedinUrl ?? "",
    translations: translationsToForm(setting.translations, EMPTY_TRANSLATION),
  };
}

function emptyToNull(value: string) {
  return value === "" ? null : value;
}

function toInput(values: SiteSettingFormValues): UpdateSiteSettingInput {
  return {
    phone: emptyToNull(values.phone),
    email: emptyToNull(values.email),
    mapImageId: values.mapImage?.id ?? null,
    mapUrl: emptyToNull(values.mapUrl),
    facebookUrl: emptyToNull(values.facebookUrl),
    instagramUrl: emptyToNull(values.instagramUrl),
    youtubeUrl: emptyToNull(values.youtubeUrl),
    linkedinUrl: emptyToNull(values.linkedinUrl),
    translations: formToTranslations(
      values.translations,
    ) as UpdateSiteSettingInput["translations"],
  };
}

interface FormSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="grid gap-5">
      <div className="grid gap-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

interface SiteSettingFormProps {
  setting: SiteSetting;
}

export function SiteSettingForm({ setting }: SiteSettingFormProps) {
  const updateSiteSetting = useUpdateSiteSetting();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SiteSettingFormValues>({
    resolver: zodResolver(siteSettingFormSchema),
    defaultValues: defaultValues(setting),
  });

  const translations = useWatch({ control, name: "translations" });

  const submit = handleSubmit((values) => {
    updateSiteSetting.mutate(toInput(values), {
      onSuccess: (savedSetting) => {
        reset(defaultValues(savedSetting));
        toast.success("Холбоо барих мэдээлэл хадгалагдлаа");
      },
      onError: (error) => toast.error(error.message),
    });
  });

  return (
    <form onSubmit={submit} noValidate className="grid max-w-3xl gap-10">
      <FormSection
        title="Үндсэн мэдээлэл"
        description="«Холбоо барих» хуудас болон сайтын хөл хэсэгт харагдана."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Утас"
            htmlFor="setting-phone"
            error={errors.phone?.message}
          >
            <Input
              id="setting-phone"
              type="tel"
              placeholder="+976 7700 0000"
              aria-invalid={Boolean(errors.phone)}
              {...register("phone")}
            />
          </FormField>
          <FormField
            label="Ерөнхий имэйл"
            htmlFor="setting-email"
            hint="Холбоо барих формоор алба сонгоогүй ирсэн захидал энд очно"
            error={errors.email?.message}
          >
            <Input
              id="setting-email"
              type="email"
              placeholder="info@cosmo.mn"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </FormField>
        </div>

        <TranslationTabs
          hasError={(locale) => Boolean(errors.translations?.[locale])}
          isFilled={(locale) => isTranslationFilled(translations[locale])}
        >
          {(locale) => (
            <>
              <FormField
                label="Хаяг"
                htmlFor={`setting-address-${locale}`}
                error={errors.translations?.[locale]?.address?.message}
              >
                <Textarea
                  id={`setting-address-${locale}`}
                  rows={2}
                  aria-invalid={Boolean(errors.translations?.[locale]?.address)}
                  {...register(`translations.${locale}.address`)}
                />
              </FormField>
              <FormField
                label="Ажлын цаг"
                htmlFor={`setting-hours-${locale}`}
                hint="Жишээ нь: Даваа–Баасан 09:00–18:00"
                error={errors.translations?.[locale]?.workingHours?.message}
              >
                <Input
                  id={`setting-hours-${locale}`}
                  aria-invalid={Boolean(
                    errors.translations?.[locale]?.workingHours,
                  )}
                  {...register(`translations.${locale}.workingHours`)}
                />
              </FormField>
            </>
          )}
        </TranslationTabs>
      </FormSection>

      <FormSection
        title="Байршил"
        description="Google Maps Хятадад нээгдэхгүй тул сайт дээр газрын зургийн зураг харагдана. Зочин дарахад Google Maps нээгдэнэ."
      >
        <FormField
          label="Газрын зургийн зураг"
          htmlFor="setting-map-image"
          hint="Google Maps дээр байршлаа томруулаад дэлгэцийн зураг авч оруулна. Хэвтээ зураг тохиромжтой"
        >
          <Controller
            control={control}
            name="mapImage"
            render={({ field }) => (
              <MediaField
                value={field.value}
                onChange={field.onChange}
                pickerTitle="Газрын зургийн зураг сонгох"
                removable
              />
            )}
          />
        </FormField>
        <FormField
          label="Google Maps холбоос"
          htmlFor="setting-map-url"
          hint="Google Maps дээр байршлаа нээгээд «Хуваалцах» → «Холбоос хуулах»"
          error={errors.mapUrl?.message}
        >
          <Input
            id="setting-map-url"
            type="url"
            placeholder="https://maps.app.goo.gl/..."
            aria-invalid={Boolean(errors.mapUrl)}
            {...register("mapUrl")}
          />
        </FormField>
      </FormSection>

      <FormSection
        title="Сошиал хаягууд"
        description="Хоосон үлдээсэн нь сайт дээр харагдахгүй."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {SOCIAL_FIELDS.map((social) => (
            <FormField
              key={social.name}
              label={social.label}
              htmlFor={`setting-${social.name}`}
              error={errors[social.name]?.message}
            >
              <Input
                id={`setting-${social.name}`}
                type="url"
                placeholder="https://"
                aria-invalid={Boolean(errors[social.name])}
                {...register(social.name)}
              />
            </FormField>
          ))}
        </div>
      </FormSection>

      <SaveBar
        isNew={false}
        isDirty={isDirty}
        isPending={updateSiteSetting.isPending}
        createLabel="Хадгалах"
      />
    </form>
  );
}
