"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface OptionSelectProps<T extends string> {
  id: string;
  value: T;
  labels: Record<T, string>;
  onChange: (value: T) => void;
  className?: string;
}

export function OptionSelect<T extends string>({
  id,
  value,
  labels,
  onChange,
  className,
}: OptionSelectProps<T>) {
  const options = Object.keys(labels) as T[];

  return (
    <Select
      items={labels}
      value={value}
      onValueChange={(next) => {
        if (next) {
          onChange(next as T);
        }
      }}
    >
      <SelectTrigger id={id} className={cn("w-full", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {labels[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
