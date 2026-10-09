import { z } from "zod";
import {
  optionalIdSchema,
  optionalUrlSchema,
  translationsSchema,
} from "./common";

const statCountSchema = z
  .number()
  .int()
  .min(0)
  .max(10_000_000)
  .nullable()
  .optional();

export const updateSiteSettingSchema = z.object({
  phone: z.string().trim().max(50).nullable().optional(),
  email: z.email().nullable().optional(),
  facebookUrl: optionalUrlSchema,
  instagramUrl: optionalUrlSchema,
  youtubeUrl: optionalUrlSchema,
  linkedinUrl: optionalUrlSchema,
  mapUrl: optionalUrlSchema,
  mapImageId: optionalIdSchema,
  foodImageId: optionalIdSchema,
  beautyImageId: optionalIdSchema,
  householdImageId: optionalIdSchema,
  foundedYear: z.number().int().min(1900).max(2100).nullable().optional(),
  employeeCount: statCountSchema,
  partnerCount: statCountSchema,
  translations: translationsSchema({
    address: z.string().trim().max(500).optional(),
    workingHours: z.string().trim().max(200).optional(),
  }).optional(),
});

export type UpdateSiteSettingInput = z.infer<typeof updateSiteSettingSchema>;
