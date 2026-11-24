"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateSlideInput } from "@cosmo/shared";
import { Loader2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField } from "@/components/admin/form-field";
import { DEFAULT_FRAME_PREVIEWS } from "@/components/admin/media/image-frame-dialog";
import { MediaField } from "@/components/admin/media/media-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSaveSlide } from "@/lib/queries/slides";
import type { Media, Slide } from "@/lib/types";

const slideFormSchema = z.object({
  media: z
    .custom<Media | null>()
    .refine((media) => media !== null, "Видео эсвэл зураг сонгоно уу"),
  poster: z.custom<Media | null>(),
  isActive: z.boolean(),
});

type SlideFormInput = z.input<typeof slideFormSchema>;
type SlideFormValues = z.output<typeof slideFormSchema>;

function defaultValues(slide: Slide | null): SlideFormInput {
  if (!slide) {
    return {
      media: null,
      poster: null,
      isActive: true,
    };
  }

  return {
    media: slide.media,
    poster: slide.poster,
    isActive: slide.isActive,
  };
}

function toInput(values: SlideFormValues): CreateSlideInput {
  return {
    mediaId: values.media.id,
    posterId:
      values.media.type === "VIDEO" ? (values.poster?.id ?? null) : null,
    isActive: values.isActive,
  };
}

interface SlideFormProps {
  slide: Slide | null;
  onDone: () => void;
}

function SlideForm({ slide, onDone }: SlideFormProps) {
  const saveSlide = useSaveSlide();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SlideFormInput, unknown, SlideFormValues>({
    resolver: zodResolver(slideFormSchema),
    defaultValues: defaultValues(slide),
  });

  const media = useWatch({ control, name: "media" });

  const onSubmit = handleSubmit((values) => {
    saveSlide.mutate(
      { id: slide?.id, input: toInput(values) },
      {
        onSuccess: () => {
          toast.success(slide ? "Слайд хадгалагдлаа" : "Слайд нэмэгдлээ");
          onDone();
        },
        onError: (error) => toast.error(error.message),
      },
    );
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <FormField
        label="Видео эсвэл зураг"
        htmlFor="slide-media"
        required
        error={errors.media?.message}
        hint="1920×1080 харьцаатай. Видео нь дуугүй MP4, 20MB хүртэл байвал хурдан ачаална"
      >
        <Controller
          control={control}
          name="media"
          render={({ field }) => (
            <MediaField
              value={field.value}
              onChange={field.onChange}
              allowedTypes={["IMAGE", "VIDEO"]}
              invalid={Boolean(errors.media)}
              framePreviews={DEFAULT_FRAME_PREVIEWS}
            />
          )}
        />
      </FormField>

      {media?.type === "VIDEO" && (
        <FormField
          label="Poster зураг"
          htmlFor="slide-poster"
          hint="Видео ачаалагдах хооронд болон интернэт удаан үед харагдана. Видеоны эхний кадрыг зураг болгож оруулахад тохиромжтой"
        >
          <Controller
            control={control}
            name="poster"
            render={({ field }) => (
              <MediaField
                value={field.value}
                onChange={field.onChange}
                pickerTitle="Poster зураг сонгох"
                removable
              />
            )}
          />
        </FormField>
      )}

      <Controller
        control={control}
        name="isActive"
        render={({ field }) => (
          <div className="flex items-center gap-3">
            <Switch
              id="slide-active"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor="slide-active">Сайт дээр харуулах</Label>
          </div>
        )}
      />

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onDone}>
          Болих
        </Button>
        <Button type="submit" disabled={saveSlide.isPending}>
          {saveSlide.isPending && <Loader2 className="animate-spin" />}
          Хадгалах
        </Button>
      </DialogFooter>
    </form>
  );
}

interface SlideFormDialogProps {
  slide: Slide | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SlideFormDialog({
  slide,
  open,
  onOpenChange,
}: SlideFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{slide ? "Слайд засах" : "Шинэ слайд"}</DialogTitle>
        </DialogHeader>
        {open && (
          <SlideForm
            key={slide?.id ?? "new"}
            slide={slide}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
