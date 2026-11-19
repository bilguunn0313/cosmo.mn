import { z } from "zod";
import { slugSchema, translationsSchema } from "./common";

export const JOB_DEPARTMENTS = [
  "warehouse",
  "sales",
  "administration",
  "finance",
  "management",
  "businessDevelopment",
  "marketing",
  "it",
] as const;
export type JobDepartment = (typeof JOB_DEPARTMENTS)[number];

export const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "SHIFT",
  "CONTRACT",
  "INTERNSHIP",
] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const JOB_STAGES = ["OPEN", "INTERVIEW", "DECIDED"] as const;
export type JobStage = (typeof JOB_STAGES)[number];

export const COMPANY_TIME_ZONE = "Asia/Ulaanbaatar";
const COMPANY_UTC_OFFSET = "+08:00";

export function startOfCompanyDay(date: string) {
  return new Date(`${date}T00:00:00${COMPANY_UTC_OFFSET}`);
}

export function endOfCompanyDay(date: string) {
  return new Date(`${date}T23:59:59.999${COMPANY_UTC_OFFSET}`);
}

const companyDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: COMPANY_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function toCompanyDate(value: Date | string) {
  return companyDateFormatter.format(new Date(value));
}

const listTextSchema = z.string().trim().max(5000).optional();

const jobPostingFields = z.object({
  slug: slugSchema,
  department: z.enum(JOB_DEPARTMENTS),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  stage: z.enum(JOB_STAGES),
  openedOn: z.iso.date(),
  closesOn: z.iso.date().nullable(),
  isPublished: z.boolean(),
  translations: translationsSchema({
    title: z.string().trim().min(1).max(200),
    location: z.string().trim().max(200).optional(),
    salary: z.string().trim().max(200).optional(),
    summary: z.string().trim().max(1000).optional(),
    duties: listTextSchema,
    requirements: listTextSchema,
    offers: listTextSchema,
  }),
});

export const createJobPostingSchema = jobPostingFields.extend({
  stage: z.enum(JOB_STAGES).default("OPEN"),
  closesOn: z.iso.date().nullable().default(null),
  isPublished: z.boolean().default(false),
});

export const updateJobPostingSchema = jobPostingFields.partial();

export type CreateJobPostingInput = z.infer<typeof createJobPostingSchema>;
export type UpdateJobPostingInput = z.infer<typeof updateJobPostingSchema>;
