import { z } from "zod";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locales";

export const idSchema = z.number().int().positive();

export const optionalIdSchema = idSchema.nullable().optional();

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Зөвхөн жижиг латин үсэг, тоо, зураас (-) ашиглана",
  });

export const optionalUrlSchema = z.string().trim().max(500).nullable().optional();

export const reorderSchema = z.object({
  ids: z.array(idSchema).min(1),
});

export type ReorderInput = z.infer<typeof reorderSchema>;

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

type WithLocale = { locale: Locale };

function hasDefaultLocale(list: WithLocale[]) {
  return list.some((t) => t.locale === DEFAULT_LOCALE);
}

function hasUniqueLocales(list: WithLocale[]) {
  return new Set(list.map((t) => t.locale)).size === list.length;
}

export function translationsSchema<T extends z.ZodRawShape>(fields: T) {
  return z
    .array(z.object({ locale: z.enum(LOCALES), ...fields }))
    .refine((list) => hasDefaultLocale(list as WithLocale[]), {
      message: "Монгол орчуулга заавал байх ёстой",
    })
    .refine((list) => hasUniqueLocales(list as WithLocale[]), {
      message: "Нэг хэл давхардсан байна",
    });
}
