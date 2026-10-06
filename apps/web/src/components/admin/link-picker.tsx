"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLinkTargets, type LinkTarget } from "@/lib/queries/link-targets";
import {
  isExternalUrl,
  normalizeInternalPath,
  SITE_PAGES,
} from "@/lib/site-links";

const NO_LINK = "none";
const EXTERNAL_LINK = "external";

interface LinkPickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}

function selectedKey(value: string) {
  if (value === "") {
    return NO_LINK;
  }

  if (isExternalUrl(value)) {
    return EXTERNAL_LINK;
  }

  return normalizeInternalPath(value);
}

function targetLabel(target: LinkTarget) {
  return target.isPublished ? target.label : `${target.label} (нийтлэгдээгүй)`;
}

export function LinkPicker({ id, value, onChange, invalid }: LinkPickerProps) {
  const targets = useLinkTargets();
  const brands = targets.data?.brands ?? [];
  const news = targets.data?.news ?? [];
  const key = selectedKey(value);

  const labels: Record<string, string> = {
    [NO_LINK]: "Товч байхгүй",
    [EXTERNAL_LINK]: "Өөр сайт руу",
    ...Object.fromEntries(SITE_PAGES.map((page) => [page.path, page.label])),
    ...Object.fromEntries(
      brands.map((brand) => [brand.path, `Брэнд: ${targetLabel(brand)}`]),
    ),
    ...Object.fromEntries(
      news.map((item) => [item.path, `Мэдээ: ${targetLabel(item)}`]),
    ),
  };

  const isUnknownPath =
    key !== NO_LINK && key !== EXTERNAL_LINK && !labels[key];
  if (isUnknownPath) {
    labels[key] = key;
  }

  const handleSelect = (next: string | null) => {
    if (next === null || next === NO_LINK) {
      onChange("");
      return;
    }

    onChange(next === EXTERNAL_LINK ? "https://" : next);
  };

  return (
    <div className="grid gap-2">
      <Select items={labels} value={key} onValueChange={handleSelect}>
        <SelectTrigger id={id} className="w-full" aria-invalid={invalid}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NO_LINK}>{labels[NO_LINK]}</SelectItem>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Сайтын хуудсууд</SelectLabel>
            {SITE_PAGES.map((page) => (
              <SelectItem key={page.path} value={page.path}>
                {page.label}
              </SelectItem>
            ))}
          </SelectGroup>
          {brands.length > 0 && (
            <SelectGroup>
              <SelectLabel>Брэндүүд</SelectLabel>
              {brands.map((brand) => (
                <SelectItem key={brand.path} value={brand.path}>
                  {targetLabel(brand)}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          {news.length > 0 && (
            <SelectGroup>
              <SelectLabel>Сүүлийн мэдээ</SelectLabel>
              {news.map((item) => (
                <SelectItem key={item.path} value={item.path}>
                  {targetLabel(item)}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          {isUnknownPath && (
            <SelectGroup>
              <SelectLabel>Одоогийн хаяг</SelectLabel>
              <SelectItem value={key}>{key}</SelectItem>
            </SelectGroup>
          )}
          <SelectSeparator />
          <SelectItem value={EXTERNAL_LINK}>{labels[EXTERNAL_LINK]}</SelectItem>
        </SelectContent>
      </Select>

      {key === EXTERNAL_LINK && (
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://"
          aria-label="Өөр сайтын хаяг"
          aria-invalid={invalid}
        />
      )}
    </div>
  );
}
