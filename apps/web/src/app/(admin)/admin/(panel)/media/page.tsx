"use client";

import { useState } from "react";
import { MediaDetailsDialog } from "@/components/admin/media/media-details-dialog";
import { MediaGrid } from "@/components/admin/media/media-grid";
import { MediaTypeTabs } from "@/components/admin/media/media-type-tabs";
import { UploadDropzone } from "@/components/admin/media/upload-dropzone";
import { PageHeader } from "@/components/admin/page-header";
import type { Media, MediaType } from "@/lib/types";

export default function MediaLibraryPage() {
  const [type, setType] = useState<MediaType | undefined>();
  const [openedMedia, setOpenedMedia] = useState<Media | null>(null);

  return (
    <div className="grid gap-8">
      <PageHeader
        title="Зургийн сан"
        description="Сайтад ашиглах бүх зураг, видео. Нэг файлыг олон газар ашиглаж болно."
      />

      <UploadDropzone />

      <div className="grid gap-4">
        <MediaTypeTabs value={type} onChange={setType} />
        <MediaGrid type={type} onSelect={setOpenedMedia} />
      </div>

      <MediaDetailsDialog
        media={openedMedia}
        onClose={() => setOpenedMedia(null)}
      />
    </div>
  );
}
