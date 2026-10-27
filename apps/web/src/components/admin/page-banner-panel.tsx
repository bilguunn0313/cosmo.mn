"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MediaField } from "@/components/admin/media/media-field";
import { PanelHeader } from "@/components/admin/panel-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSiteSetting,
  useUpdateSiteSetting,
} from "@/lib/queries/site-settings";
import type { Media, SiteSetting } from "@/lib/types";

const BANNER_FIELDS = {
  about: { id: "aboutBannerImageId", media: "aboutBannerImage" },
  careers: { id: "careersBannerImageId", media: "careersBannerImage" },
  media: { id: "mediaBannerImageId", media: "mediaBannerImage" },
  brands: { id: "brandsBannerImageId", media: "brandsBannerImage" },
  contact: { id: "contactBannerImageId", media: "contactBannerImage" },
} as const;

type BannerPage = keyof typeof BANNER_FIELDS;

interface PageBannerFormProps {
  page: BannerPage;
  setting: SiteSetting;
}

function PageBannerForm({ page, setting }: PageBannerFormProps) {
  const fields = BANNER_FIELDS[page];
  const savedImage = setting[fields.media];
  const updateSiteSetting = useUpdateSiteSetting();
  const [image, setImage] = useState<Media | null>(savedImage);
  const isDirty = image?.id !== savedImage?.id;

  const save = () => {
    updateSiteSetting.mutate(
      { [fields.id]: image?.id ?? null },
      {
        onSuccess: () => toast.success("Толгой зураг хадгалагдлаа"),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <div className="grid max-w-xl gap-4">
      <MediaField
        value={image}
        onChange={setImage}
        pickerTitle="Хуудасны толгой зураг"
        removable
      />
      <p className="text-sm text-muted-foreground">
        Зураг оруулаагүй үед түр жишээ зураг харагдана.
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

interface PageBannerPanelProps {
  page: BannerPage;
  step?: number;
}

export function PageBannerPanel({ page, step }: PageBannerPanelProps) {
  const setting = useSiteSetting();

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={step}
        title="Толгой зураг"
        description="Хуудасны хамгийн дээд талын том зураг. Хэвтээ, 2400×1200 орчим зураг тохиромжтой. Доод хэсэгт гарчиг цагаанаар бичигдэнэ."
      />
      {setting.data ? (
        <PageBannerForm
          key={setting.data.updatedAt}
          page={page}
          setting={setting.data}
        />
      ) : (
        <Skeleton className="h-40 max-w-xl rounded-xl" />
      )}
    </section>
  );
}
