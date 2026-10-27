"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/admin/form-field";
import { MediaField } from "@/components/admin/media/media-field";
import { PanelHeader } from "@/components/admin/panel-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSiteSetting,
  useUpdateSiteSetting,
} from "@/lib/queries/site-settings";
import type { Media, SiteSetting } from "@/lib/types";

function AboutImageForm({ setting }: { setting: SiteSetting }) {
  const updateSiteSetting = useUpdateSiteSetting();
  const [image, setImage] = useState<Media | null>(setting.homeAboutImage);
  const isDirty = image?.id !== setting.homeAboutImage?.id;

  const save = () => {
    updateSiteSetting.mutate(
      { homeAboutImageId: image?.id ?? null },
      {
        onSuccess: () => toast.success("Зураг хадгалагдлаа"),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <div className="grid max-w-md gap-6">
      <FormField label="Зураг" htmlFor="home-about-image">
        <MediaField
          value={image}
          onChange={setImage}
          pickerTitle="«Бидний тухай» хэсгийн зураг"
          removable
        />
      </FormField>

      <p className="text-sm text-muted-foreground">
        Зураг оруулаагүй үед брэндийн контейнерийн түр зураг харагдана.
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

interface AboutImagePanelProps {
  step: number;
}

export function AboutImagePanel({ step }: AboutImagePanelProps) {
  const setting = useSiteSetting();

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={step}
        title="«Бидний тухай» хэсгийн зураг"
        description="Тоон үзүүлэлтийн доор, текстийн зүүн талд том зураг. Агуулах, машин, хамт олны хэвтээ (5:4 орчим) зураг тохиромжтой."
      />
      {setting.data ? (
        <AboutImageForm key={setting.data.updatedAt} setting={setting.data} />
      ) : (
        <Skeleton className="h-40 max-w-md rounded-xl" />
      )}
    </section>
  );
}
