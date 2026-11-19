"use client";

import { LOCALES } from "@cosmo/shared";
import type { UpdateSectionInput } from "@cosmo/shared";
import { CopyPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SectionsPanel } from "@/components/admin/sections/sections-panel";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_BUSINESS_AREAS,
  loadDefaultAreaTexts,
} from "@/lib/business-areas";
import { plainTextToHtml } from "@/lib/plain-text";
import { useSaveSection, useSections } from "@/lib/queries/sections";
import { uploadMedia } from "@/lib/upload";

const HOME_SOURCE = { page: "home" } as const;

async function uploadDefaultImage(imageUrl: string, key: string) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const file = new File([blob], `area-${key}.webp`, { type: "image/webp" });
  return uploadMedia(file, () => {});
}

function CopyDefaultAreas() {
  const saveSection = useSaveSection(HOME_SOURCE);
  const [isCopying, setIsCopying] = useState(false);

  const copyDefaults = async () => {
    setIsCopying(true);

    try {
      const texts = await Promise.all(LOCALES.map(loadDefaultAreaTexts));

      for (const area of DEFAULT_BUSINESS_AREAS) {
        const image = await uploadDefaultImage(area.imageUrl, area.key);
        const translations = LOCALES.map((locale, index) => ({
          locale,
          title: texts[index][area.key].title,
          body: plainTextToHtml(texts[index][area.key].text),
        }));

        await saveSection.mutateAsync({
          input: {
            imageId: image.id,
            isVisible: true,
            translations,
          } satisfies UpdateSectionInput,
        });
      }

      toast.success("5 карт нэмэгдлээ. Одоо зураг, текстийг нь засаж болно.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Алдаа гарлаа");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-dashed p-4">
      <p className="max-w-xl text-sm text-muted-foreground">
        Одоо сайт дээр анхны 5 карт харагдаж байна. Тэдгээрийг энд хуулж аваад
        зураг, текстийг нь сольж болно. Энд нэг ч карт нэмбэл сайт дээр зөвхөн
        энд байгаа картууд харагдана.
      </p>
      <Button variant="outline" onClick={copyDefaults} disabled={isCopying}>
        {isCopying ? <Loader2 className="animate-spin" /> : <CopyPlus />}
        Анхны 5 картыг хуулах
      </Button>
    </div>
  );
}

interface BusinessAreasPanelProps {
  step: number;
}

export function BusinessAreasPanel({ step }: BusinessAreasPanelProps) {
  const sections = useSections(HOME_SOURCE);
  const isEmpty = sections.data?.length === 0;

  return (
    <div className="grid gap-4">
      <SectionsPanel
        source={HOME_SOURCE}
        step={step}
        title="Бидний хийдэг зүйл"
        description="Нүүр хуудасны цэнхэр хэсгийн зурагтай картууд. Гарчгийг богино, текстийг 1–2 өгүүлбэр байлгавал зураг дээр гоё харагдана."
        emptyText="Одоогоор карт алга."
        bodyMode="plain"
        isImageRequired
      />
      {isEmpty && <CopyDefaultAreas />}
    </div>
  );
}
