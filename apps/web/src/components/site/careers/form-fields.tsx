import { Check } from "lucide-react";
import {
  errorClass,
  growTextarea,
  inputClass,
  labelClass,
  requiredMarkClass,
  textareaClass,
} from "@/components/site/form-styles";
import { cn } from "@/lib/utils";

const CHIP_CLASS =
  "inline-flex h-11 cursor-pointer items-center gap-2 rounded-control border px-4 text-sm font-semibold transition-colors duration-200";
const CHIP_IDLE_CLASS = "border-ink-3 bg-white text-ink hover:bg-brand-100";
const CHIP_SELECTED_CLASS = "border-brand bg-brand text-white";
const CHIP_FOCUS_CLASS =
  "outline-brand outline-offset-2 focus-visible:outline-2";

export function RequiredMark() {
  return (
    <span aria-hidden className={requiredMarkClass}>
      {" "}
      *
    </span>
  );
}

interface FieldProps {
  id: string;
  label: string;
  error?: string | null;
  isRequired?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  id,
  label,
  error,
  isRequired = false,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("grid content-start gap-1", className)}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {isRequired && <RequiredMark />}
      </label>
      {children}
      {error && (
        <span id={`${id}-error`} className={errorClass}>
          {error}
        </span>
      )}
    </div>
  );
}

interface TextFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  error?: string | null;
  type?: "text" | "tel";
  autoComplete?: string;
  maxLength?: number;
  isRequired?: boolean;
  isNumeric?: boolean;
  isMultiline?: boolean;
  disabled?: boolean;
  className?: string;
}

export function TextField({
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  autoComplete,
  maxLength,
  isRequired = false,
  isNumeric = false,
  isMultiline = false,
  disabled = false,
  className,
}: TextFieldProps) {
  const id = `anket-${name}`;
  const sharedProps = {
    id,
    name,
    value,
    placeholder,
    disabled,
    maxLength,
    "aria-required": isRequired || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };

  return (
    <Field
      id={id}
      label={label}
      error={error}
      isRequired={isRequired}
      className={className}
    >
      {isMultiline ? (
        <textarea
          {...sharedProps}
          rows={1}
          onChange={(event) => onChange(name, event.target.value)}
          onInput={growTextarea}
          className={cn(inputClass, textareaClass)}
        />
      ) : (
        <input
          {...sharedProps}
          type={type}
          autoComplete={autoComplete}
          inputMode={isNumeric ? "numeric" : undefined}
          onChange={(event) => onChange(name, event.target.value)}
          className={cn(inputClass, "h-11")}
        />
      )}
    </Field>
  );
}

interface Option {
  value: string;
  label: string;
}

interface ChipGroupProps {
  label: string;
  options: Option[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: ChipGroupProps) {
  return (
    <fieldset className="grid gap-2.5">
      <legend className="mb-2.5 text-[13px] font-medium text-ink-2">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(option.value)}
              className={cn(
                CHIP_CLASS,
                CHIP_FOCUS_CLASS,
                isSelected ? CHIP_SELECTED_CLASS : CHIP_IDLE_CLASS,
              )}
            >
              {isSelected && <Check aria-hidden className="size-4" />}
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

interface RadioChipsProps {
  id: string;
  name: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
  error?: string | null;
}

export function RadioChips({
  id,
  name,
  label,
  options,
  value,
  onChange,
  isRequired = false,
  error,
}: RadioChipsProps) {
  const errorId = `${id}-error`;

  return (
    <fieldset
      className="grid gap-2.5"
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="mb-2.5 text-[13px] font-medium text-ink-2">
        {label}
        {isRequired && <RequiredMark />}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const isChecked = value === option.value;

          return (
            <label key={option.value}>
              <input
                id={index === 0 ? id : undefined}
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                required={isRequired}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  CHIP_CLASS,
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand",
                  isChecked ? CHIP_SELECTED_CLASS : CHIP_IDLE_CLASS,
                  error && !isChecked && "border-danger",
                )}
              >
                <span
                  aria-hidden
                  className="flex size-4 items-center justify-center rounded-full border-[1.5px] border-current"
                >
                  {isChecked && (
                    <span className="size-1.5 rounded-full bg-current" />
                  )}
                </span>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <span id={errorId} className={errorClass}>
          {error}
        </span>
      )}
    </fieldset>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex min-h-11 w-fit cursor-pointer items-center gap-2.5 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4.5 accent-brand"
      />
      {label}
    </label>
  );
}
