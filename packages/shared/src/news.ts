import { z } from "zod";
import {
  optionalIdSchema,
  paginationSchema,
  slugSchema,
  translationsSchema,
} from "./common";
import { localeSchema } from "./locales";

const newsFields = z.object({
  slug: slugSchema,
  coverImageId: optionalIdSchema,
  videoId: optionalIdSchema,
  isPublished: z.boolean(),
  publishedAt: z.iso.datetime().nullable().optional(),
  translations: translationsSchema({
    title: z.string().trim().min(1).max(300),
    summary: z.string().trim().max(1000).optional(),
    content: z.string().trim().min(1).max(100000),
  }),
});

export const createNewsSchema = newsFields.extend({
  isPublished: z.boolean().default(false),
});

export const updateNewsSchema = newsFields.partial();

export const adminNewsQuerySchema = paginationSchema;

export const publicNewsQuerySchema = paginationSchema.extend({
  locale: localeSchema,
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
export type AdminNewsQuery = z.infer<typeof adminNewsQuerySchema>;
export type PublicNewsQuery = z.infer<typeof publicNewsQuerySchema>;
