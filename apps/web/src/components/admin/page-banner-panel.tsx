"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DEFAULT_FRAME_PREVIEWS,
  type FramePreview,
} from "@/components/admin/media/image-frame-dialog";
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
  hrGovernance: { id: "hrGovernanceImageId", media: "hrGovernanceImage" },
  hrJobs: { id: "hrJobsImageId", media: "hrJobsImage" },
  ceo: { id: "ceoImageId", media: "ceoImage" },
} as const;

type BannerPage = keyof typeof BANNER_FIELDS;

const SIDE_BY_SIDE_PREVIEWS: FramePreview[] = [
  { label: "Том дэлгэц", ratio: 4 / 5 },
  { label: "Компьютер", ratio: 2 / 3 },
  { label: "Таблет", ratio: 4 / 3 },
  { label: "Утас", ratio: 4 / 5 },
];

const FRAME_PREVIEWS: Partial<Record<BannerPage, FramePreview[]>> = {
  about: [
    { label: "Компьютер", ratio: 1.26 },
    { label: "Таблет", ratio: 16 / 9 },
    { label: "Утас", ratio: 4 / 3 },
  ],
  ceo: SIDE_BY_SIDE_PREVIEWS,
  hrJobs: [
    { label: "Компьютер", ratio: 9 / 8 },
    { label: "Таблет, утас", ratio: 4 / 3 },
  ],
};

interface PageBannerFormProps {
  page: BannerPage;
  setting: SiteSetting;
  pickerTitle: string;
  emptyHint: string;
}

function PageBannerForm({
  page,
  setting,
  pickerTitle,
  emptyHint,
}: PageBannerFormProps) {
  const fields = BANNER_FIELDS[page];
  const savedImage = setting[fields.media];
  const updateSiteSetting = useUpdateSiteSetting();
  const [image, setImage] = useState<Media | null>(savedImage);
  const isDirty = image?.id !== savedImage?.id;

  const save = () => {
    updateSiteSetting.mutate(
      { [fields.id]: image?.id ?? null },
      {
        onSuccess: () => toast.success("Зураг хадгалагдлаа"),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <div className="grid max-w-xl gap-4">
      <MediaField
        value={image}
        onChange={setImage}
        pickerTitle={pickerTitle}
        removable
        framePreviews={FRAME_PREVIEWS[page] ?? DEFAULT_FRAME_PREVIEWS}
      />
      <p className="text-sm text-muted-foreground">{emptyHint}</p>
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

const DEFAULT_TITLE = "Баннер зураг";
const DEFAULT_EMPTY_HINT = "Зураг оруулаагүй үед түр жишээ зураг харагдана.";
const DEFAULT_DESCRIPTION =
  "Хуудасны хамгийн дээд талын том зураг. Хэвтээ, 2400×1200 орчим зураг тохиромжтой. Доод хэсэгт гарчиг цагаанаар бичигдэнэ.";

interface PageBannerPanelProps {
  page: BannerPage;
  step?: number;
  title?: string;
  description?: string;
  emptyHint?: string;
}

export function PageBannerPanel({
  page,
  step,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  emptyHint = DEFAULT_EMPTY_HINT,
}: PageBannerPanelProps) {
  const setting = useSiteSetting();

  return (
    <section className="grid gap-4">
      <PanelHeader step={step} title={title} description={description} />
      {setting.data ? (
        <PageBannerForm
          key={setting.data.updatedAt}
          page={page}
          setting={setting.data}
          pickerTitle={title}
          emptyHint={emptyHint}
        />
      ) : (
        <Skeleton className="h-40 max-w-xl rounded-xl" />
      )}
    </section>
  );
}
