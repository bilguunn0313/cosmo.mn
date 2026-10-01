import { z } from "zod";
import { idSchema, translationsSchema } from "./common";
import { localeSchema } from "./locales";

export const contactSchema = z.object({
  departmentId: idSchema.optional(),
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(10).max(2000),
  locale: localeSchema,
});

const contactDepartmentFields = z.object({
  email: z.email(),
  isActive: z.boolean(),
  translations: translationsSchema({
    name: z.string().trim().min(1).max(100),
  }),
});

export const createContactDepartmentSchema = contactDepartmentFields.extend({
  isActive: z.boolean().default(true),
});

export const updateContactDepartmentSchema = contactDepartmentFields.partial();

export type ContactInput = z.infer<typeof contactSchema>;
export type CreateContactDepartmentInput = z.infer<typeof createContactDepartmentSchema>;
export type UpdateContactDepartmentInput = z.infer<typeof updateContactDepartmentSchema>;
