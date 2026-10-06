"use client";

import { Copy, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes, formatDate } from "@/lib/format";
import { useDeleteMedia, useMediaUsages } from "@/lib/queries/media";
import type { Media, MediaUsageType } from "@/lib/types";

const USAGE_LABELS: Record<MediaUsageType, string> = {
  slide: "Нүүр хуудасны carousel",
  brand: "Брэнд",
  brandSection: "Брэндийн хэсэг",
  section: "Хуудасны хэсэг",
  news: "Медиа",
};

interface MediaDetailsDialogProps {
  media: Media | null;
  onClose: () => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate text-right">{value}</dd>
    </div>
  );
}

export function MediaDetailsDialog({
  media,
  onClose,
}: MediaDetailsDialogProps) {
  const usages = useMediaUsages(media?.id ?? null);
  const deleteMedia = useDeleteMedia();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isUsed = (usages.data?.length ?? 0) > 0;

  const copyUrl = async () => {
    if (!media) {
      return;
    }

    await navigator.clipboard.writeText(
      new URL(media.url, window.location.origin).toString(),
    );
    toast.success("Холбоос хуулагдлаа");
  };

  const handleDelete = () => {
    if (!media) {
      return;
    }

    deleteMedia.mutate(media.id, {
      onSuccess: () => {
        toast.success("Файл устгагдлаа");
        setIsConfirmOpen(false);
        onClose();
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <>
      <Dialog open={media !== null} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-2xl">
          {media && (
            <>
              <DialogHeader>
                <DialogTitle className="truncate pr-8">
                  {media.originalName}
                </DialogTitle>
              </DialogHeader>

              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                {media.type === "IMAGE" ? (
                  <Image
                    src={media.url}
                    alt={media.originalName}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                ) : (
                  <video
                    src={media.url}
                    controls
                    muted
                    playsInline
                    className="size-full object-contain"
                  />
                )}
              </div>

              <dl className="grid gap-2">
                <InfoRow
                  label="Төрөл"
                  value={media.type === "IMAGE" ? "Зураг" : "Видео"}
                />
                <InfoRow label="Хэмжээ" value={formatBytes(media.size)} />
                {media.width && media.height && (
                  <InfoRow
                    label="Харьцаа"
                    value={`${media.width} × ${media.height}`}
                  />
                )}
                <InfoRow label="Оруулсан" value={formatDate(media.createdAt)} />
              </dl>

              <div className="grid gap-2 rounded-lg bg-muted/50 p-3">
                <p className="text-sm font-medium">Хаана ашиглагдаж байна</p>
                {usages.isPending ? (
                  <Skeleton className="h-4 w-48" />
                ) : isUsed ? (
                  <ul className="grid gap-1 text-sm">
                    {usages.data?.map((usage) => (
                      <li key={`${usage.type}-${usage.id}`}>
                        <span className="text-muted-foreground">
                          {USAGE_LABELS[usage.type]}:
                        </span>{" "}
                        {usage.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Одоогоор хаана ч ашиглагдаагүй
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button variant="outline" onClick={() => void copyUrl()}>
                  <Copy />
                  Холбоос хуулах
                </Button>
                <Button
                  variant="destructive"
                  disabled={usages.isPending || isUsed}
                  onClick={() => setIsConfirmOpen(true)}
                >
                  <Trash2 />
                  Устгах
                </Button>
              </div>
              {isUsed && (
                <p className="text-xs text-muted-foreground">
                  Ашиглагдаж байгаа файлыг устгах боломжгүй. Эхлээд дээрх
                  газруудаас өөр файлаар солино уу.
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Файлыг устгах уу?</AlertDialogTitle>
            <AlertDialogDescription>
              {media?.originalName} бүрмөсөн устах бөгөөд буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Болих</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMedia.isPending}
            >
              Устгах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
