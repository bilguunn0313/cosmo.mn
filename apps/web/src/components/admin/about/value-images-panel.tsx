"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/admin/form-field";
import { MediaField } from "@/components/admin/media/media-field";
import { PanelHeader } from "@/components/admin/panel-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VALUE_KEYS, type ValueKey } from "@/lib/about";
import {
  useSiteSetting,
  useUpdateSiteSetting,
} from "@/lib/queries/site-settings";
import type { Media, SiteSetting } from "@/lib/types";

type ValueImages = Record<ValueKey, Media | null>;

const VALUE_LABELS: Record<ValueKey, string> = {
  people: "Хүн",
  satisfaction: "Сэтгэл ханамж",
  quality: "Чанар",
  responsibility: "Нийгмийн хариуцлага",
};

function imagesFrom(setting: SiteSetting): ValueImages {
  return {
    people: setting.valuePeopleImage,
    satisfaction: setting.valueSatisfactionImage,
    quality: setting.valueQualityImage,
    responsibility: setting.valueResponsibilityImage,
  };
}

function ValueImagesForm({ setting }: { setting: SiteSetting }) {
  const updateSiteSetting = useUpdateSiteSetting();
  const [images, setImages] = useState<ValueImages>(() => imagesFrom(setting));
  const saved = imagesFrom(setting);
  const isDirty = VALUE_KEYS.some((key) => images[key]?.id !== saved[key]?.id);

  const save = () => {
    updateSiteSetting.mutate(
      {
        valuePeopleImageId: images.people?.id ?? null,
        valueSatisfactionImageId: images.satisfaction?.id ?? null,
        valueQualityImageId: images.quality?.id ?? null,
        valueResponsibilityImageId: images.responsibility?.id ?? null,
      },
      {
        onSuccess: () => toast.success("Үнэт зүйлсийн зураг хадгалагдлаа"),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <div className="grid max-w-4xl gap-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VALUE_KEYS.map((key) => (
          <FormField
            key={key}
            label={VALUE_LABELS[key]}
            htmlFor={`value-image-${key}`}
          >
            <MediaField
              value={images[key]}
              onChange={(media) =>
                setImages((current) => ({ ...current, [key]: media }))
              }
              pickerTitle={`«${VALUE_LABELS[key]}» үнэт зүйлийн зураг`}
              removable
            />
          </FormField>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Зураг оруулаагүй үнэт зүйлд түр жишээ зураг харагдана.
      </p>

      <Button
        type="button"
        className="w-fit"
        onClick={save}
        disabled={!isDirty || updateSiteSetting.isPending}
      >
        {updateSiteSetting.isPending && <Loader2 className="animate-spin" />}
        Хадгалах
      </Button>
    </div>
  );
}

interface ValueImagesPanelProps {
  step: number;
}

export function ValueImagesPanel({ step }: ValueImagesPanelProps) {
  const setting = useSiteSetting();

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={step}
        title="Үнэт зүйлсийн зураг"
        description="«Үнэт зүйл» хэсгийн 4 картын дэвсгэр зураг. Зураг дээр текст цагаанаар бичигдэх тул доод хэсэг нь хэт цайвар биш, босоо (4:5 орчим) зураг тохиромжтой."
      />
      {setting.data ? (
        <ValueImagesForm key={setting.data.updatedAt} setting={setting.data} />
      ) : (
        <Skeleton className="h-40 max-w-4xl rounded-xl" />
      )}
    </section>
  );
}
