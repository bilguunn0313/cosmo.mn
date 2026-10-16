import {
  errorClass,
  inputClass,
  labelClass,
} from "@/components/site/form-styles";
import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  error?: string | null;
  className?: string;
  children: React.ReactNode;
}

export function Field({ id, label, error, className, children }: FieldProps) {
  return (
    <div className={cn("grid content-start gap-1.5", className)}>
      <label htmlFor={id} className={labelClass}>
        {label}
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
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };

  return (
    <Field id={id} label={label} error={error} className={className}>
      {isMultiline ? (
        <textarea
          {...sharedProps}
          rows={3}
          onChange={(event) => onChange(name, event.target.value)}
          className={cn(inputClass, "resize-y py-3")}
        />
      ) : (
        <input
          {...sharedProps}
          inputMode={isNumeric ? "numeric" : undefined}
          onChange={(event) => onChange(name, event.target.value)}
          className={cn(inputClass, "h-12")}
        />
      )}
    </Field>
  );
}

interface ChipGroupProps {
  label: string;
  options: { value: string; label: string }[];
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
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected.includes(option.value)}
            onClick={() => onToggle(option.value)}
            className="h-11 border border-ink-3 px-4 text-[15px] font-semibold transition-colors duration-200 hover:bg-brand-100 aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-white"
          >
            {option.label}
          </button>
        ))}
      </div>
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
    <label className="flex w-fit cursor-pointer items-center gap-2.5 text-[15px]">
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
