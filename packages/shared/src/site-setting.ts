import { z } from "zod";
import {
  optionalIdSchema,
  optionalUrlSchema,
  translationsSchema,
} from "./common";

export const MAP_EMBED_PREFIX = "https://www.google.com/maps/embed";

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
  hrEmail: z.email().nullable().optional(),
  facebookUrl: optionalUrlSchema,
  instagramUrl: optionalUrlSchema,
  youtubeUrl: optionalUrlSchema,
  linkedinUrl: optionalUrlSchema,
  mapUrl: optionalUrlSchema,
  mapEmbedUrl: z
    .string()
    .trim()
    .max(2000)
    .startsWith(
      MAP_EMBED_PREFIX,
      "Google Maps-ийн «Embed a map» код оруулна уу",
    )
    .nullable()
    .optional(),
  mapImageId: optionalIdSchema,
  aboutBannerImageId: optionalIdSchema,
  careersBannerImageId: optionalIdSchema,
  mediaBannerImageId: optionalIdSchema,
  brandsBannerImageId: optionalIdSchema,
  contactBannerImageId: optionalIdSchema,
  valuePeopleImageId: optionalIdSchema,
  valueSatisfactionImageId: optionalIdSchema,
  valueQualityImageId: optionalIdSchema,
  valueResponsibilityImageId: optionalIdSchema,
  homeAboutImageId: optionalIdSchema,
  foundedYear: z.number().int().min(1900).max(2100).nullable().optional(),
  employeeCount: statCountSchema,
  salesPointCount: statCountSchema,
  productCount: statCountSchema,
  translations: translationsSchema({
    address: z.string().trim().max(500).optional(),
    workingHours: z.string().trim().max(200).optional(),
  }).optional(),
});

export type UpdateSiteSettingInput = z.infer<typeof updateSiteSettingSchema>;
