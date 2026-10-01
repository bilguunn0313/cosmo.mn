import { z } from "zod";
import {
  optionalIdSchema,
  optionalUrlSchema,
  paginationSchema,
  slugSchema,
  translationsSchema,
} from "./common";
import { localeSchema } from "./locales";

export const NEWS_TYPES = ["NEWS", "CAMPAIGN"] as const;
export type NewsType = (typeof NEWS_TYPES)[number];

const newsFields = z.object({
  slug: slugSchema,
  type: z.enum(NEWS_TYPES),
  coverImageId: optionalIdSchema,
  videoUrl: optionalUrlSchema,
  isPublished: z.boolean(),
  publishedAt: z.iso.datetime().nullable().optional(),
  translations: translationsSchema({
    title: z.string().trim().min(1).max(300),
    summary: z.string().trim().max(1000).optional(),
    content: z.string().trim().min(1).max(100000),
  }),
});

export const createNewsSchema = newsFields.extend({
  type: z.enum(NEWS_TYPES).default("NEWS"),
  isPublished: z.boolean().default(false),
});

export const updateNewsSchema = newsFields.partial();

export const adminNewsQuerySchema = paginationSchema.extend({
  type: z.enum(NEWS_TYPES).optional(),
});

export const publicNewsQuerySchema = paginationSchema.extend({
  type: z.enum(NEWS_TYPES).optional(),
  locale: localeSchema,
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
export type AdminNewsQuery = z.infer<typeof adminNewsQuerySchema>;
export type PublicNewsQuery = z.infer<typeof publicNewsQuerySchema>;
