import { z } from "zod";
import { localeSchema } from "./locales";

export const GENDERS = ["male", "female"] as const;

export const APPLICATION_DISTRICTS = [
  "bayangol",
  "bayanzurkh",
  "songinokhairkhan",
  "sukhbaatar",
  "khanUul",
  "chingeltei",
  "nalaikh",
  "baganuur",
  "bagakhangai",
  "countryside",
] as const;

export const APPLICATION_LANGUAGES = [
  "english",
  "russian",
  "chinese",
  "korean",
  "japanese",
  "german",
] as const;

export const APPLICATION_SOFTWARE = [
  "MS Word",
  "Excel",
  "PowerPoint",
  "1С / ERP",
  "Photoshop",
  "AutoCAD",
] as const;

export const START_OPTIONS = ["now", "twoWeeks", "oneMonth", "custom"] as const;

export const MIN_APPLICANT_AGE = 15;
export const MAX_APPLICANT_AGE = 80;
export const MAX_PHOTO_BYTES = 1024 * 1024;
export const PHOTO_MIME_TYPES = ["image/jpeg", "image/png"] as const;

const text = (max: number) => z.string().trim().max(max);

const previousJobSchema = z.object({
  company: text(200),
  role: text(200),
  from: text(10),
  to: text(10),
  isCurrent: z.boolean(),
  duties: text(2000),
});

export const jobApplicationSchema = z.object({
  locale: localeSchema,
  lastName: text(100).min(1),
  firstName: text(100).min(1),
  age: z.number().int().min(MIN_APPLICANT_AGE).max(MAX_APPLICANT_AGE),
  gender: z.enum(GENDERS),
  phone: z.string().regex(/^\d{8}$/),
  district: z.enum(APPLICATION_DISTRICTS).nullable(),
  address: text(200),
  education: z.object({
    school: text(200),
    degree: text(200),
    from: text(10),
    to: text(10),
    isStudying: z.boolean(),
  }),
  hasNoExperience: z.boolean(),
  previousJobs: z.array(previousJobSchema).max(2),
  languages: z.array(z.enum(APPLICATION_LANGUAGES)).max(APPLICATION_LANGUAGES.length),
  software: z.array(z.enum(APPLICATION_SOFTWARE)).max(APPLICATION_SOFTWARE.length),
  otherSoftware: text(300),
  startOption: z.enum(START_OPTIONS).nullable(),
  startDate: z.union([z.literal(""), z.iso.date()]),
});

export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
export type Gender = (typeof GENDERS)[number];
export type ApplicationDistrict = (typeof APPLICATION_DISTRICTS)[number];
export type ApplicationLanguage = (typeof APPLICATION_LANGUAGES)[number];
export type ApplicationSoftware = (typeof APPLICATION_SOFTWARE)[number];
export type StartOption = (typeof START_OPTIONS)[number];
