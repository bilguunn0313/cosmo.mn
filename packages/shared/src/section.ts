import { z } from "zod";
import { optionalIdSchema, optionalUrlSchema, translationsSchema } from "./common";
import { localeSchema } from "./locales";

export const SECTION_PAGES = ["home", "about", "human-resources"] as const;
export type SectionPage = (typeof SECTION_PAGES)[number];

const sectionFields = z.object({
  imageId: optionalIdSchema,
  linkUrl: optionalUrlSchema,
  isVisible: z.boolean(),
  translations: translationsSchema({
    title: z.string().trim().min(1).max(200),
    body: z.string().trim().min(1).max(50000),
  }),
});

export const createSectionSchema = sectionFields.extend({
  page: z.enum(SECTION_PAGES),
  isVisible: z.boolean().default(true),
});

export const updateSectionSchema = sectionFields.partial();

export const adminSectionsQuerySchema = z.object({
  page: z.enum(SECTION_PAGES),
});

export const publicSectionsQuerySchema = z.object({
  page: z.enum(SECTION_PAGES),
  locale: localeSchema,
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
export type AdminSectionsQuery = z.infer<typeof adminSectionsQuerySchema>;
export type PublicSectionsQuery = z.infer<typeof publicSectionsQuerySchema>;
