"use client";

import { COUNTRY_CODES } from "@cosmo/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NO_COUNTRY = "none";

const countryNames = new Intl.DisplayNames(["mn"], { type: "region" });

const COUNTRY_OPTIONS = COUNTRY_CODES.map((code) => ({
  code,
  name: countryNames.of(code) ?? code,
})).sort((a, b) => a.name.localeCompare(b.name, "mn"));

const LABELS: Record<string, string> = {
  [NO_COUNTRY]: "Сонгоогүй",
  ...Object.fromEntries(COUNTRY_OPTIONS.map(({ code, name }) => [code, name])),
};

interface CountrySelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export function CountrySelect({ id, value, onChange }: CountrySelectProps) {
  return (
    <Select
      items={LABELS}
      value={value || NO_COUNTRY}
      onValueChange={(next) =>
        onChange(!next || next === NO_COUNTRY ? "" : next)
      }
    >
      <SelectTrigger id={id} className="w-full sm:w-72">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NO_COUNTRY}>{LABELS[NO_COUNTRY]}</SelectItem>
        {COUNTRY_OPTIONS.map(({ code, name }) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
