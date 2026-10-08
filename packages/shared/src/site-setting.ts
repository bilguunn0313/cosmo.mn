import { z } from "zod";
import {
  optionalIdSchema,
  optionalUrlSchema,
  translationsSchema,
} from "./common";

export const updateSiteSettingSchema = z.object({
  phone: z.string().trim().max(50).nullable().optional(),
  email: z.email().nullable().optional(),
  facebookUrl: optionalUrlSchema,
  instagramUrl: optionalUrlSchema,
  youtubeUrl: optionalUrlSchema,
  linkedinUrl: optionalUrlSchema,
  mapUrl: optionalUrlSchema,
  mapImageId: optionalIdSchema,
  translations: translationsSchema({
    address: z.string().trim().max(500).optional(),
    workingHours: z.string().trim().max(200).optional(),
  }).optional(),
});

export type UpdateSiteSettingInput = z.infer<typeof updateSiteSettingSchema>;
