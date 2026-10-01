import { z } from "zod";
import {
  optionalIdSchema,
  optionalUrlSchema,
  slugSchema,
  translationsSchema,
} from "./common";
import { localeSchema } from "./locales";

export const BRAND_CATEGORIES = ["FOOD", "BEAUTY", "HOUSEHOLD"] as const;
export type BrandCategory = (typeof BRAND_CATEGORIES)[number];

const brandFields = z.object({
  slug: slugSchema,
  categories: z
    .array(z.enum(BRAND_CATEGORIES))
    .min(1, { message: "Дор хаяж нэг ангилал сонгоно уу" })
    .refine((list) => new Set(list).size === list.length, {
      message: "Ангилал давхардсан байна",
    }),
  logoId: optionalIdSchema,
  coverId: optionalIdSchema,
  websiteUrl: optionalUrlSchema,
  isPublished: z.boolean(),
  translations: translationsSchema({
    name: z.string().trim().min(1).max(200),
    summary: z.string().trim().max(1000).optional(),
  }),
});

export const createBrandSchema = brandFields.extend({
  isPublished: z.boolean().default(false),
});

export const updateBrandSchema = brandFields.partial();

const brandSectionFields = z.object({
  imageId: optionalIdSchema,
  isVisible: z.boolean(),
  translations: translationsSchema({
    title: z.string().trim().min(1).max(200),
    body: z.string().trim().min(1).max(50000),
  }),
});

export const createBrandSectionSchema = brandSectionFields.extend({
  isVisible: z.boolean().default(true),
});

export const updateBrandSectionSchema = brandSectionFields.partial();

export const publicBrandsQuerySchema = z.object({
  locale: localeSchema,
  category: z.enum(BRAND_CATEGORIES).optional(),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type CreateBrandSectionInput = z.infer<typeof createBrandSectionSchema>;
export type UpdateBrandSectionInput = z.infer<typeof updateBrandSectionSchema>;
export type PublicBrandsQuery = z.infer<typeof publicBrandsQuerySchema>;
