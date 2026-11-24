import { z } from "zod";
import { paginationSchema } from "./common";

export const MEDIA_TYPES = ["IMAGE", "VIDEO"] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const VIDEO_MIME_TYPES = ["video/mp4", "video/webm"] as const;

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;

export const adminMediaQuerySchema = paginationSchema.extend({
  type: z.enum(MEDIA_TYPES).optional(),
});

export type AdminMediaQuery = z.infer<typeof adminMediaQuerySchema>;

export const MAX_MEDIA_ZOOM = 3;

export const updateMediaFrameSchema = z.object({
  focusX: z.number().min(0).max(100),
  focusY: z.number().min(0).max(100),
  zoom: z.number().min(1).max(MAX_MEDIA_ZOOM),
});

export type UpdateMediaFrameInput = z.infer<typeof updateMediaFrameSchema>;
