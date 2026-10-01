import { z } from "zod";
import { idSchema, optionalIdSchema, optionalUrlSchema, translationsSchema } from "./common";

const slideFields = z.object({
  mediaId: idSchema,
  posterId: optionalIdSchema,
  linkUrl: optionalUrlSchema,
  isActive: z.boolean(),
  translations: translationsSchema({
    title: z.string().trim().min(1).max(200),
    subtitle: z.string().trim().min(1).max(300).optional(),
    buttonText: z.string().trim().min(1).max(50).optional(),
  }),
});

export const createSlideSchema = slideFields.extend({
  isActive: z.boolean().default(true),
});

export const updateSlideSchema = slideFields.partial();

export type CreateSlideInput = z.infer<typeof createSlideSchema>;
export type UpdateSlideInput = z.infer<typeof updateSlideSchema>;
