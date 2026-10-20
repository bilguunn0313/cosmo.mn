"use client";

import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { inputClass } from "@/components/site/form-styles";
import { siteButtonClass } from "@/components/site/site-button";
import { cn } from "@/lib/utils";
import { Checkbox, ChipGroup, Field, TextField } from "./form-fields";

const EMPTY_VALUES = {
  name: "",
  position: "",
  phone: "",
  district: "",
  khoroo: "",
  school: "",
  degree: "",
  studyFrom: "",
  studyTo: "",
  company1: "",
  role1: "",
  from1: "",
  to1: "",
  duties1: "",
  company2: "",
  role2: "",
  from2: "",
  to2: "",
  duties2: "",
  otherSoftware: "",
  startDate: "",
};

type FormValues = typeof EMPTY_VALUES;

const STEP_KEYS = ["basic", "education", "experience", "skills"] as const;
const LAST_STEP = STEP_KEYS.length;
const PHONE_DIGITS = 8;

const DISTRICT_KEYS = [
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

const LANGUAGE_KEYS = [
  "english",
  "russian",
  "chinese",
  "korean",
  "japanese",
  "german",
] as const;

const SOFTWARE_NAMES = [
  "MS Word",
  "Excel",
  "PowerPoint",
  "1С / ERP",
  "Photoshop",
  "AutoCAD",
];

const START_KEYS = ["now", "twoWeeks", "oneMonth", "custom"] as const;

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function ApplicationForm() {
  const t = useTranslations("careers.form");
  const shouldReduceMotion = useReducedMotion();
  const formRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [furthestStep, setFurthestStep] = useState(1);
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [showErrors, setShowErrors] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [hasNoExperience, setHasNoExperience] = useState(false);
  const [hasSecondJob, setHasSecondJob] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [software, setSoftware] = useState<string[]>([]);
  const [startOption, setStartOption] = useState("");
  const [isDone, setIsDone] = useState(false);

  const errors = {
    name: values.name.trim() ? null : t("errors.name"),
    position: values.position.trim() ? null : t("errors.position"),
    phone:
      values.phone.replace(/\D/g, "").length === PHONE_DIGITS
        ? null
        : t("errors.phone"),
  };
  const hasStepOneErrors = Boolean(
    errors.name || errors.position || errors.phone,
  );
  const visibleError = (key: keyof typeof errors) =>
    showErrors ? errors[key] : null;

  const updateValue = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const goToStep = (target: number) => {
    setStep(target);
    setFurthestStep((current) => Math.max(current, target));
    scrollToForm();
  };

  const handleNext = (event: React.FormEvent) => {
    event.preventDefault();

    if (step === 1 && hasStepOneErrors) {
      setShowErrors(true);
      return;
    }

    setShowErrors(false);

    if (step === LAST_STEP) {
      setIsDone(true);
      scrollToForm();
      return;
    }

    goToStep(step + 1);
  };

  const reset = () => {
    setStep(1);
    setFurthestStep(1);
    setValues(EMPTY_VALUES);
    setShowErrors(false);
    setIsStudying(false);
    setHasNoExperience(false);
    setHasSecondJob(false);
    setLanguages([]);
    setSoftware([]);
    setStartOption("");
    setIsDone(false);
  };

  if (isDone) {
    const firstName = values.name.trim().split(/\s+/).pop() ?? "";

    return (
      <div
        ref={formRef}
        className="animate-in fade-in slide-in-from-bottom-4 grid scroll-mt-28 justify-items-start gap-5 bg-brand px-6 py-12 text-white duration-500 ease-(--ease-out) md:px-12 md:py-14"
      >
        <Check className="size-12" strokeWidth={2.5} />
        <h3 className="type-h2">{t("thanksTitle", { name: firstName })}</h3>
        <p className="max-w-130 text-base leading-relaxed">
          {t("thanksText", { phone: values.phone })}
        </p>
        <button
          type="button"
          onClick={reset}
          className={siteButtonClass("white", "min-w-55")}
        >
          {t("newForm")}
          <ArrowRight className="size-4.5" />
        </button>
      </div>
    );
  }

  return (
    <div ref={formRef} className="scroll-mt-28">
      <ol className="grid grid-cols-4 gap-2">
        {STEP_KEYS.map((key, index) => {
          const stepNumber = index + 1;
          const isReachable = stepNumber <= furthestStep;

          return (
            <li key={key}>
              <button
                type="button"
                disabled={!isReachable}
                aria-current={stepNumber === step ? "step" : undefined}
                onClick={() => goToStep(stepNumber)}
                className="group grid w-full gap-2.5 text-left disabled:cursor-default"
              >
                <span
                  className={cn(
                    "h-1 w-full transition-colors duration-300",
                    stepNumber <= step ? "bg-brand" : "bg-rule",
                  )}
                />
                <span
                  className={cn(
                    "text-[13px] font-semibold tracking-[0.04em]",
                    stepNumber === step && "text-brand-700",
                    stepNumber !== step && isReachable && "text-ink",
                    !isReachable && "text-ink-3",
                  )}
                >
                  0{stepNumber}
                  <span className="hidden sm:inline"> {t(`steps.${key}`)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <form onSubmit={handleNext} noValidate>
        <div
          key={step}
          className="animate-in fade-in slide-in-from-bottom-2 grid gap-5 py-10 duration-500 ease-(--ease-out)"
        >
          {step === 1 && (
            <>
              <h3 className="type-h3">{t("steps.basic")}</h3>
              <TextField
                name="name"
                label={t("fields.name")}
                placeholder={t("placeholders.name")}
                value={values.name}
                onChange={updateValue}
                error={visibleError("name")}
              />
              <TextField
                name="position"
                label={t("fields.position")}
                placeholder={t("placeholders.position")}
                value={values.position}
                onChange={updateValue}
                error={visibleError("position")}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  name="phone"
                  label={t("fields.phone")}
                  placeholder="8809 3511"
                  value={values.phone}
                  onChange={updateValue}
                  error={visibleError("phone")}
                  isNumeric
                />
                <Field id="anket-district" label={t("fields.district")}>
                  <select
                    id="anket-district"
                    value={values.district}
                    onChange={(event) =>
                      updateValue("district", event.target.value)
                    }
                    className={cn(inputClass, "h-12")}
                  >
                    <option value="">{t("choose")}</option>
                    {DISTRICT_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {t(`districts.${key}`)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <TextField
                name="khoroo"
                label={t("fields.khoroo")}
                placeholder={t("placeholders.khoroo")}
                value={values.khoroo}
                onChange={updateValue}
              />
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="type-h3">{t("steps.education")}</h3>
              <TextField
                name="school"
                label={t("fields.school")}
                placeholder={t("placeholders.school")}
                value={values.school}
                onChange={updateValue}
              />
              <TextField
                name="degree"
                label={t("fields.degree")}
                placeholder={t("placeholders.degree")}
                value={values.degree}
                onChange={updateValue}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  name="studyFrom"
                  label={t("fields.studyFrom")}
                  placeholder="2016"
                  value={values.studyFrom}
                  onChange={updateValue}
                  isNumeric
                />
                <TextField
                  name="studyTo"
                  label={t("fields.studyTo")}
                  placeholder={isStudying ? t("placeholders.studying") : "2020"}
                  value={values.studyTo}
                  onChange={updateValue}
                  disabled={isStudying}
                  isNumeric
                />
              </div>
              <Checkbox
                label={t("fields.isStudying")}
                checked={isStudying}
                onChange={setIsStudying}
              />
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h3 className="type-h3">{t("steps.experience")}</h3>
                <span className="text-sm text-ink-3">{t("lastTwoJobs")}</span>
              </div>
              <Checkbox
                label={t("fields.noExperience")}
                checked={hasNoExperience}
                onChange={setHasNoExperience}
              />
              {!hasNoExperience && (
                <>
                  <ExperienceFields
                    jobNumber={1}
                    values={values}
                    onChange={updateValue}
                  />
                  {hasSecondJob ? (
                    <ExperienceFields
                      jobNumber={2}
                      values={values}
                      onChange={updateValue}
                      onRemove={() => setHasSecondJob(false)}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setHasSecondJob(true)}
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
            </>
          )}

          {step === 4 && (
            <div className="grid gap-7">
              <h3 className="type-h3">{t("steps.skills")}</h3>
              <ChipGroup
                label={t("fields.languages")}
                options={LANGUAGE_KEYS.map((key) => ({
                  value: key,
                  label: t(`languages.${key}`),
                }))}
                selected={languages}
                onToggle={(value) =>
                  setLanguages(toggleValue(languages, value))
                }
              />
              <div className="grid gap-2.5">
                <ChipGroup
                  label={t("fields.software")}
                  options={SOFTWARE_NAMES.map((name) => ({
                    value: name,
                    label: name,
                  }))}
                  selected={software}
                  onToggle={(value) =>
                    setSoftware(toggleValue(software, value))
                  }
                />
                <TextField
                  name="otherSoftware"
                  label={t("fields.otherSoftware")}
                  value={values.otherSoftware}
                  onChange={updateValue}
                />
              </div>
              <div className="grid gap-2.5">
                <ChipGroup
                  label={t("fields.startDate")}
                  options={START_KEYS.map((key) => ({
                    value: key,
                    label: t(`startOptions.${key}`),
                  }))}
                  selected={[startOption]}
                  onToggle={(value) =>
                    setStartOption(startOption === value ? "" : value)
                  }
                />
                {startOption === "custom" && (
                  <input
                    type="date"
                    aria-label={t("fields.startDate")}
                    value={values.startDate}
                    onChange={(event) =>
                      updateValue("startDate", event.target.value)
                    }
                    className={cn(inputClass, "h-12 max-w-70")}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-3 pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => goToStep(step - 1)}
              className={siteButtonClass(
                "secondary",
                "min-w-35 justify-start gap-2.5",
              )}
            >
              <ArrowLeft className="size-4.5" />
              {t("back")}
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            className={siteButtonClass("primary", "min-w-50 sm:min-w-60")}
          >
            {step === LAST_STEP ? t("submit") : t("next")}
            <ArrowRight className="size-4.5" />
          </button>
        </div>
      </form>
    </div>
  );
}

interface ExperienceFieldsProps {
  jobNumber: 1 | 2;
  values: FormValues;
  onChange: (name: string, value: string) => void;
  onRemove?: () => void;
}

function ExperienceFields({
  jobNumber,
  values,
  onChange,
  onRemove,
}: ExperienceFieldsProps) {
  const t = useTranslations("careers.form");
  const company = `company${jobNumber}` as const;
  const role = `role${jobNumber}` as const;
  const from = `from${jobNumber}` as const;
  const to = `to${jobNumber}` as const;
  const duties = `duties${jobNumber}` as const;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 grid gap-4 pt-5 duration-500 ease-(--ease-out)">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold tracking-[0.06em] text-brand uppercase">
          {t("jobLabel", { number: jobNumber })}
        </span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className={siteButtonClass("ghost", "text-[13px]")}
          >
            {t("remove")}
          </button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          name={company}
          label={t("fields.company")}
          value={values[company]}
          onChange={onChange}
        />
        <TextField
          name={role}
          label={t("fields.role")}
          value={values[role]}
          onChange={onChange}
        />
        <TextField
          name={from}
          label={t("fields.from")}
          placeholder="2020"
          value={values[from]}
          onChange={onChange}
          isNumeric
        />
        <TextField
          name={to}
          label={t("fields.to")}
          placeholder={t("placeholders.now")}
          value={values[to]}
          onChange={onChange}
          isNumeric
        />
      </div>
      <TextField
        name={duties}
        label={t("fields.duties")}
        placeholder={t("placeholders.duties")}
        value={values[duties]}
        onChange={onChange}
        isMultiline
      />
    </div>
  );
}
