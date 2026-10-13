import { z } from "zod";
import { optionalIdSchema, translationsSchema } from "./common";

const milestoneFields = z.object({
  year: z.number().int().min(1900).max(2100),
  imageId: optionalIdSchema,
  isVisible: z.boolean(),
  translations: translationsSchema({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(1000).nullable().optional(),
  }),
});

export const createMilestoneSchema = milestoneFields.extend({
  isVisible: z.boolean().default(true),
});

export const updateMilestoneSchema = milestoneFields.partial();

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
