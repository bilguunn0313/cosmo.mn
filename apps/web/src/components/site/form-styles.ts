import type { FormEvent } from "react";

export const inputClass =
  "w-full rounded-none border-0 border-b border-ink/25 bg-transparent px-0 text-[17px] text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-ink-3 focus-visible:border-brand focus-visible:shadow-[0_1px_0_var(--color-brand)] focus-visible:outline-none aria-invalid:border-danger disabled:border-ink/15 disabled:text-ink-3";

export const textareaClass =
  "block min-h-11 resize-none overflow-hidden py-2.5 leading-normal";

export const labelClass = "text-[13px] font-medium text-ink-2";

export const errorClass = "text-[13px] font-semibold text-danger";

export const formButtonClass =
  "inline-flex h-12 items-center gap-2.5 rounded-full border border-brand px-6.5 text-base font-medium text-brand outline-offset-3 outline-brand transition-[background-color,color,scale] duration-200 ease-out hover:bg-brand hover:text-white focus-visible:outline-2 disabled:opacity-70 motion-safe:active:scale-[0.97]";

export function growTextarea(event: FormEvent<HTMLTextAreaElement>) {
  const textarea = event.currentTarget;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}
