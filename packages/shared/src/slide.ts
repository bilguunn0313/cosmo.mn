import { z } from "zod";
import { idSchema, optionalIdSchema } from "./common";

const slideFields = z.object({
  mediaId: idSchema,
  posterId: optionalIdSchema,
  isActive: z.boolean(),
});

export const createSlideSchema = slideFields.extend({
  isActive: z.boolean().default(true),
});

export const updateSlideSchema = slideFields.partial();

export type CreateSlideInput = z.infer<typeof createSlideSchema>;
export type UpdateSlideInput = z.infer<typeof updateSlideSchema>;
