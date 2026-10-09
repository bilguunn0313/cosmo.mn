"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/admin/form-field";
import { MediaField } from "@/components/admin/media/media-field";
import { PanelHeader } from "@/components/admin/panel-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BRAND_CATEGORY_LABELS } from "@/lib/brand-categories";
import {
  useSiteSetting,
  useUpdateSiteSetting,
} from "@/lib/queries/site-settings";
import type { BrandCategory, Media, SiteSetting } from "@/lib/types";

type CategoryImages = Record<BrandCategory, Media | null>;

const CATEGORY_ORDER: BrandCategory[] = ["FOOD", "BEAUTY", "HOUSEHOLD"];

function imagesFrom(setting: SiteSetting): CategoryImages {
  return {
    FOOD: setting.foodImage,
    BEAUTY: setting.beautyImage,
    HOUSEHOLD: setting.householdImage,
  };
}

function CategoryImagesForm({ setting }: { setting: SiteSetting }) {
  const updateSiteSetting = useUpdateSiteSetting();
  const [images, setImages] = useState<CategoryImages>(() =>
    imagesFrom(setting),
  );
  const saved = imagesFrom(setting);
  const isDirty = CATEGORY_ORDER.some(
    (category) => images[category]?.id !== saved[category]?.id,
  );

  const save = () => {
    updateSiteSetting.mutate(
      {
        foodImageId: images.FOOD?.id ?? null,
        beautyImageId: images.BEAUTY?.id ?? null,
        householdImageId: images.HOUSEHOLD?.id ?? null,
      },
      {
        onSuccess: () => toast.success("Ангиллын зураг хадгалагдлаа"),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <div className="grid max-w-3xl gap-6">
      <div className="grid gap-6 sm:grid-cols-3">
        {CATEGORY_ORDER.map((category) => (
          <FormField
            key={category}
            label={BRAND_CATEGORY_LABELS[category]}
            htmlFor={`category-image-${category}`}
          >
            <MediaField
              value={images[category]}
              onChange={(media) =>
                setImages((current) => ({ ...current, [category]: media }))
              }
              pickerTitle={`${BRAND_CATEGORY_LABELS[category]} ангиллын зураг`}
              removable
            />
          </FormField>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Зураг оруулаагүй ангилалд тухайн ангиллын эхний брэндийн нүүр зураг,
        түүнийг ч байхгүй бол цэнхэр градиент харагдана. Брэндгүй ангилал сайт
        дээр гарахгүй.
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

interface CategoryImagesPanelProps {
  step: number;
}

export function CategoryImagesPanel({ step }: CategoryImagesPanelProps) {
  const setting = useSiteSetting();

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={step}
        title="Брэндийн ангиллын зураг"
        description="Газрын зургийн доор Хүнс, Гоо сайхан, Ахуй бараа гэсэн 3 том хавтангаар харагдана. Хэвтээ, 1600×1000 орчим зураг тохиромжтой."
      />
      {setting.data ? (
        <CategoryImagesForm
          key={setting.data.updatedAt}
          setting={setting.data}
        />
      ) : (
        <Skeleton className="h-40 max-w-3xl rounded-xl" />
      )}
    </section>
  );
}
