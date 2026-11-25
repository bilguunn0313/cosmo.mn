"use client";

import {
  APPLICATION_DISTRICTS,
  APPLICATION_LANGUAGES,
  APPLICATION_SOFTWARE,
  GENDERS,
  MAX_APPLICANT_AGE,
  MIN_APPLICANT_AGE,
  START_OPTIONS,
  type ApplicationDistrict,
  type ApplicationLanguage,
  type ApplicationSoftware,
  type Gender,
  type JobApplicationInput,
  type StartOption,
} from "@cosmo/shared";
import { ArrowRight, Check, Loader2, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  errorClass,
  formButtonClass,
  inputClass,
} from "@/components/site/form-styles";
import { LineSelect } from "@/components/site/line-select";
import { siteButtonClass } from "@/components/site/site-button";
import { Link } from "@/i18n/navigation";
import { apiUrl } from "@/lib/api";
import { JOBS_PATH } from "@/lib/site-links";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Checkbox,
  ChipGroup,
  Field,
  RadioChips,
  TextField,
} from "./form-fields";
import { PhotoField, type Photo } from "./photo-field";

interface PreviousJob {
  company: string;
  role: string;
  from: string;
  to: string;
  isCurrent: boolean;
  duties: string;
}

interface Draft {
  lastName: string;
  firstName: string;
  age: string;
  gender: Gender | "";
  phone: string;
  district: ApplicationDistrict | "";
  address: string;
  school: string;
  degree: string;
  studyFrom: string;
  studyTo: string;
  isStudying: boolean;
  hasNoExperience: boolean;
  previousJobs: PreviousJob[];
  languages: ApplicationLanguage[];
  software: ApplicationSoftware[];
  otherSoftware: string;
  startOption: StartOption | "";
  startDate: string;
}

type TextKey = {
  [Key in keyof Draft]: Draft[Key] extends string ? Key : never;
}[keyof Draft];

const EMPTY_JOB: PreviousJob = {
  company: "",
  role: "",
  from: "",
  to: "",
  isCurrent: false,
  duties: "",
};

const EMPTY_DRAFT: Draft = {
  lastName: "",
  firstName: "",
  age: "",
  gender: "",
  phone: "",
  district: "",
  address: "",
  school: "",
  degree: "",
  studyFrom: "",
  studyTo: "",
  isStudying: false,
  hasNoExperience: false,
  previousJobs: [EMPTY_JOB],
  languages: [],
  software: [],
  otherSoftware: "",
  startOption: "",
  startDate: "",
};

const MAX_PREVIOUS_JOBS = 2;
const PHONE_DIGITS = 8;
const YEAR_LENGTH = 4;
const TOO_MANY_REQUESTS = 429;
const NOT_FOUND = 404;

const REQUIRED_FIELDS = [
  "photo",
  "lastName",
  "firstName",
  "age",
  "gender",
  "phone",
] as const;

function draftStorageKey(jobSlug: string) {
  return `anket-draft:${jobSlug}`;
}

function readDraft(jobSlug: string): Draft {
  try {
    const saved = sessionStorage.getItem(draftStorageKey(jobSlug));
    return saved ? { ...EMPTY_DRAFT, ...JSON.parse(saved) } : EMPTY_DRAFT;
  } catch {
    return EMPTY_DRAFT;
  }
}

function saveDraft(jobSlug: string, draft: Draft | null) {
  try {
    if (draft) {
      sessionStorage.setItem(draftStorageKey(jobSlug), JSON.stringify(draft));
    } else {
      sessionStorage.removeItem(draftStorageKey(jobSlug));
    }
  } catch {
    return;
  }
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatPhone(phone: string) {
  const digits = digitsOnly(phone);
  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
}

function isValidAge(value: string) {
  const age = Number(value.trim());
  return (
    Number.isInteger(age) &&
    age >= MIN_APPLICANT_AGE &&
    age <= MAX_APPLICANT_AGE
  );
}

function toggleValue<T extends string>(list: T[], value: T) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function toInput(draft: Draft, locale: Locale): JobApplicationInput {
  return {
    locale,
    lastName: draft.lastName.trim(),
    firstName: draft.firstName.trim(),
    age: Number(draft.age.trim()),
    gender: draft.gender as Gender,
    phone: digitsOnly(draft.phone),
    district: draft.district || null,
    address: draft.address,
    education: {
      school: draft.school,
      degree: draft.degree,
      from: draft.studyFrom,
      to: draft.isStudying ? "" : draft.studyTo,
      isStudying: draft.isStudying,
    },
    hasNoExperience: draft.hasNoExperience,
    previousJobs: draft.hasNoExperience
      ? []
      : draft.previousJobs.map((job) => ({
          ...job,
          to: job.isCurrent ? "" : job.to,
        })),
    languages: draft.languages,
    software: draft.software,
    otherSoftware: draft.otherSoftware,
    startOption: draft.startOption || null,
    startDate: draft.startOption === "custom" ? draft.startDate : "",
  };
}

interface FormSectionProps {
  id: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}

function FormSection({ id, title, note, children }: FormSectionProps) {
  const headingId = `anket-section-${id}`;

  return (
    <section
      aria-labelledby={headingId}
      className="grid gap-7 border-t border-ink pt-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id={headingId} className="type-h3">
          {title}
        </h2>
        {note && <span className="text-sm text-ink-2">{note}</span>}
      </div>
      {children}
    </section>
  );
}

interface ApplicationFormProps {
  jobSlug: string;
  jobTitle: string;
  contactPhone: string | null;
}

const subscribeToNothing = () => () => {};

export function ApplicationForm(props: ApplicationFormProps) {
  const isBrowser = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  if (!isBrowser) {
    return <div aria-hidden className="min-h-[70vh]" />;
  }

  return <ApplicationFormContent {...props} />;
}

function ApplicationFormContent({
  jobSlug,
  jobTitle,
  contactPhone,
}: ApplicationFormProps) {
  const t = useTranslations("careers.form");
  const locale = useLocale() as Locale;
  const doneHeadingRef = useRef<HTMLHeadingElement>(null);

  const [draft, setDraft] = useState<Draft>(() => readDraft(jobSlug));
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isDone) {
      saveDraft(jobSlug, draft);
    }
  }, [jobSlug, draft, isDone]);

  useEffect(() => {
    if (isDone) {
      doneHeadingRef.current?.focus();
    }
  }, [isDone]);

  const errors = {
    photo: photo ? null : t("errors.photo"),
    lastName: draft.lastName.trim() ? null : t("errors.lastName"),
    firstName: draft.firstName.trim() ? null : t("errors.firstName"),
    age:
      draft.age.trim() === ""
        ? t("errors.age")
        : isValidAge(draft.age)
          ? null
          : t("errors.ageRange"),
    gender: draft.gender ? null : t("errors.gender"),
    phone:
      digitsOnly(draft.phone).length === PHONE_DIGITS
        ? null
        : t("errors.phone"),
  };
  const invalidFields = REQUIRED_FIELDS.filter((field) => errors[field]);
  const visibleError = (key: keyof typeof errors) =>
    showErrors ? errors[key] : null;
  const summaryError =
    showErrors && invalidFields.length > 0
      ? t("errors.summary", { count: invalidFields.length })
      : null;

  const updateDraft = (patch: Partial<Draft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const updateText = (name: string, value: string) => {
    updateDraft({ [name as TextKey]: value });
  };

  const updateJob = (index: number, patch: Partial<PreviousJob>) => {
    setDraft((current) => ({
      ...current,
      previousJobs: current.previousJobs.map((job, jobIndex) =>
        jobIndex === index ? { ...job, ...patch } : job,
      ),
    }));
  };

  const sendErrorMessage = (status: number | undefined) => {
    if (status === TOO_MANY_REQUESTS) {
      return t("errors.tooMany");
    }

    if (status === NOT_FOUND) {
      return t("errors.closed");
    }

    return contactPhone
      ? t("errors.failedCall", { phone: contactPhone })
      : t("errors.failed");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSendError(null);

    if (invalidFields.length > 0 || !photo) {
      setShowErrors(true);
      document.getElementById(`anket-${invalidFields[0]}`)?.focus();
      return;
    }

    setIsSubmitting(true);

    const body = new FormData();
    body.append("data", JSON.stringify(toInput(draft, locale)));
    body.append("photo", photo.blob, "photo.jpg");

    const response = await fetch(
      apiUrl(`/public/jobs/${encodeURIComponent(jobSlug)}/apply`),
      { method: "POST", body },
    ).catch(() => null);

    setIsSubmitting(false);

    if (response?.ok) {
      saveDraft(jobSlug, null);
      setIsDone(true);
      return;
    }

    setSendError(sendErrorMessage(response?.status));
  };

  if (isDone) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 grid justify-items-start gap-5 rounded-card bg-brand-100 px-6 py-12 duration-500 ease-(--ease-out) md:px-12 md:py-14">
        <span className="flex size-14 items-center justify-center rounded-full bg-brand text-white">
          <Check className="size-7" strokeWidth={2.5} />
        </span>
        <h2
          ref={doneHeadingRef}
          tabIndex={-1}
          className="type-h2 text-ink outline-none"
        >
          {t("thanksTitle", { name: draft.firstName.trim() })}
        </h2>
        <p className="max-w-130 text-base leading-relaxed text-ink-2">
          {t("thanksText", { job: jobTitle, phone: formatPhone(draft.phone) })}
        </p>
        <Link href={JOBS_PATH} className={formButtonClass}>
          {t("otherJobs")}
          <ArrowRight className="size-4.5" />
        </Link>
      </div>
    );
  }

  const isCountryside = draft.district === "countryside";

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-16 md:gap-20">
      <FormSection id="basic" title={t("steps.basic")}>
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-[auto_minmax(0,1fr)]">
          <PhotoField
            id="anket-photo"
            photo={photo}
            onChange={setPhoto}
            error={visibleError("photo")}
          />
          <div className="grid content-start gap-x-8 gap-y-7 sm:grid-cols-2">
            <TextField
              name="lastName"
              label={t("fields.lastName")}
              autoComplete="family-name"
              isRequired
              value={draft.lastName}
              onChange={updateText}
              error={visibleError("lastName")}
            />
            <TextField
              name="firstName"
              label={t("fields.firstName")}
              autoComplete="given-name"
              isRequired
              value={draft.firstName}
              onChange={updateText}
              error={visibleError("firstName")}
            />
            <TextField
              name="age"
              label={t("fields.age")}
              maxLength={2}
              isRequired
              isNumeric
              value={draft.age}
              onChange={updateText}
              error={visibleError("age")}
            />
            <RadioChips
              id="anket-gender"
              name="gender"
              label={t("fields.gender")}
              options={GENDERS.map((key) => ({
                value: key,
                label: t(`genders.${key}`),
              }))}
              value={draft.gender}
              onChange={(value) => updateDraft({ gender: value as Gender })}
              isRequired
              error={visibleError("gender")}
            />
          </div>
        </div>
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          <TextField
            name="phone"
            type="tel"
            label={t("fields.phone")}
            autoComplete="tel-national"
            maxLength={9}
            isRequired
            isNumeric
            value={draft.phone}
            onChange={updateText}
            error={visibleError("phone")}
          />
          <Field id="anket-district" label={t("fields.district")}>
            <LineSelect
              id="anket-district"
              value={draft.district}
              onChange={(event) =>
                updateDraft({
                  district: event.target.value as ApplicationDistrict | "",
                })
              }
              className={cn(draft.district === "" && "text-ink-3")}
            >
              <option value="">{t("choose")}</option>
              {APPLICATION_DISTRICTS.map((key) => (
                <option key={key} value={key}>
                  {t(`districts.${key}`)}
                </option>
              ))}
            </LineSelect>
          </Field>
        </div>
        <TextField
          name="address"
          label={isCountryside ? t("fields.soum") : t("fields.khoroo")}
          value={draft.address}
          onChange={updateText}
        />
      </FormSection>

      <FormSection id="education" title={t("steps.education")}>
        <TextField
          name="school"
          label={t("fields.school")}
          value={draft.school}
          onChange={updateText}
        />
        <TextField
          name="degree"
          label={t("fields.degree")}
          value={draft.degree}
          onChange={updateText}
        />
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          <TextField
            name="studyFrom"
            label={t("fields.studyFrom")}
            maxLength={YEAR_LENGTH}
            isNumeric
            value={draft.studyFrom}
            onChange={updateText}
          />
          <TextField
            name="studyTo"
            label={t("fields.studyTo")}
            placeholder={
              draft.isStudying ? t("placeholders.studying") : undefined
            }
            maxLength={YEAR_LENGTH}
            isNumeric
            disabled={draft.isStudying}
            value={draft.isStudying ? "" : draft.studyTo}
            onChange={updateText}
          />
        </div>
        <Checkbox
          label={t("fields.isStudying")}
          checked={draft.isStudying}
          onChange={(isStudying) => updateDraft({ isStudying })}
        />
      </FormSection>

      <FormSection
        id="experience"
        title={t("steps.experience")}
        note={t("lastTwoJobs")}
      >
        <Checkbox
          label={t("fields.noExperience")}
          checked={draft.hasNoExperience}
          onChange={(hasNoExperience) => updateDraft({ hasNoExperience })}
        />
        {!draft.hasNoExperience && (
          <>
            {draft.previousJobs.map((job, index) => (
              <ExperienceFields
                key={index}
                index={index}
                job={job}
                onChange={(patch) => updateJob(index, patch)}
                onRemove={
                  index > 0
                    ? () =>
                        updateDraft({
                          previousJobs: draft.previousJobs.slice(0, index),
                        })
                    : undefined
                }
              />
            ))}
            {draft.previousJobs.length < MAX_PREVIOUS_JOBS && (
              <button
                type="button"
                onClick={() =>
                  updateDraft({
                    previousJobs: [...draft.previousJobs, EMPTY_JOB],
                  })
                }
                className={siteButtonClass(
                  "secondary",
                  "h-12 w-fit justify-start gap-2.5",
                )}
              >
                <Plus className="size-4.5" />
                {t("addJob")}
              </button>
            )}
          </>
        )}
      </FormSection>

      <FormSection id="skills" title={t("steps.skills")}>
        <ChipGroup
          label={t("fields.languages")}
          options={APPLICATION_LANGUAGES.map((key) => ({
            value: key,
            label: t(`languages.${key}`),
          }))}
          selected={draft.languages}
          onToggle={(value) =>
            updateDraft({
              languages: toggleValue(
                draft.languages,
                value as ApplicationLanguage,
              ),
            })
          }
        />
        <div className="grid gap-2.5">
          <ChipGroup
            label={t("fields.software")}
            options={APPLICATION_SOFTWARE.map((name) => ({
              value: name,
              label: name,
            }))}
            selected={draft.software}
            onToggle={(value) =>
              updateDraft({
                software: toggleValue(
                  draft.software,
                  value as ApplicationSoftware,
                ),
              })
            }
          />
          <TextField
            name="otherSoftware"
            label={t("fields.otherSoftware")}
            value={draft.otherSoftware}
            onChange={updateText}
          />
        </div>
        <div className="grid gap-2.5">
          <RadioChips
            id="anket-start"
            name="startOption"
            label={t("fields.startDate")}
            options={START_OPTIONS.map((key) => ({
              value: key,
              label: t(`startOptions.${key}`),
            }))}
            value={draft.startOption}
            onChange={(value) =>
              updateDraft({ startOption: value as StartOption })
            }
          />
          {draft.startOption === "custom" && (
            <input
              type="date"
              aria-label={t("fields.startDate")}
              value={draft.startDate}
              onChange={(event) =>
                updateDraft({ startDate: event.target.value })
              }
              className={cn(inputClass, "h-11 max-w-70")}
            />
          )}
        </div>
      </FormSection>

      <div className="grid justify-items-start gap-3 border-t border-ink pt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className={formButtonClass}
        >
          {isSubmitting ? t("sending") : t("submit")}
          {isSubmitting ? (
            <Loader2 className="size-4.5 animate-spin" />
          ) : (
            <ArrowRight className="size-4.5" />
          )}
        </button>
        <div role="alert">
          {(summaryError ?? sendError) && (
            <p className={errorClass}>{summaryError ?? sendError}</p>
          )}
        </div>
      </div>
    </form>
  );
}

interface ExperienceFieldsProps {
  index: number;
  job: PreviousJob;
  onChange: (patch: Partial<PreviousJob>) => void;
  onRemove?: () => void;
}

function ExperienceFields({
  index,
  job,
  onChange,
  onRemove,
}: ExperienceFieldsProps) {
  const t = useTranslations("careers.form");
  const number = index + 1;
  const jobLabel = t("jobLabel", { number });
  const fieldName = (field: string) => `job${number}-${field}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 grid gap-4 pt-5 duration-500 ease-(--ease-out)">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold tracking-[0.06em] text-brand uppercase">
          {jobLabel}
        </span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`${t("remove")}: ${jobLabel}`}
            className={siteButtonClass("ghost", "min-h-11 text-[13px]")}
          >
            {t("remove")}
          </button>
        )}
      </div>
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <TextField
          name={fieldName("company")}
          label={t("fields.company")}
          value={job.company}
          onChange={(_, company) => onChange({ company })}
        />
        <TextField
          name={fieldName("role")}
          label={t("fields.role")}
          value={job.role}
          onChange={(_, role) => onChange({ role })}
        />
        <TextField
          name={fieldName("from")}
          label={t("fields.from")}
          maxLength={YEAR_LENGTH}
          isNumeric
          value={job.from}
          onChange={(_, from) => onChange({ from })}
        />
        <TextField
          name={fieldName("to")}
          label={t("fields.to")}
          placeholder={job.isCurrent ? t("placeholders.now") : undefined}
          maxLength={YEAR_LENGTH}
          isNumeric
          disabled={job.isCurrent}
          value={job.isCurrent ? "" : job.to}
          onChange={(_, to) => onChange({ to })}
        />
      </div>
      <Checkbox
        label={t("fields.isCurrentJob")}
        checked={job.isCurrent}
        onChange={(isCurrent) => onChange({ isCurrent })}
      />
      <TextField
        name={fieldName("duties")}
        label={t("fields.duties")}
        value={job.duties}
        onChange={(_, duties) => onChange({ duties })}
        isMultiline
      />
    </div>
  );
}
