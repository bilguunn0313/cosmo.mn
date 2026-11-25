"use client";

import type { BrandCategory } from "@cosmo/shared";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ALL = "ALL";
const MAX_STAGGER = 10;

type FilterKey = BrandCategory | typeof ALL;

export interface BrandFilterOption {
  key: FilterKey;
  label: string;
  count: number;
  resultLabel: string;
}

export interface BrandFilterItem {
  slug: string;
  categories: BrandCategory[];
  card: React.ReactNode;
}

interface BrandFilterProps {
  label: string;
  options: BrandFilterOption[];
  items: BrandFilterItem[];
}

export function BrandFilter({ label, options, items }: BrandFilterProps) {
  const [selected, setSelected] = useState<FilterKey>(ALL);
  const [hasFiltered, setHasFiltered] = useState(false);

  const selectedOption =
    options.find((option) => option.key === selected) ?? options[0];
  const visibleItems =
    selected === ALL
      ? items
      : items.filter((item) => item.categories.includes(selected));

  const select = (key: FilterKey) => {
    setSelected(key);
    setHasFiltered(true);
  };

  return (
    <>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={selected === option.key}
            onClick={() => select(option.key)}
            className="group inline-flex items-center gap-1.5 rounded-control bg-paper px-3.5 py-2 text-sm font-medium text-ink transition-[color,background-color,scale] duration-200 ease-out not-aria-pressed:hover:bg-brand-100 active:scale-[0.97] aria-pressed:bg-brand aria-pressed:text-white"
          >
            {option.label}
            <span className="text-xs text-ink-3 transition-colors duration-200 group-aria-pressed:text-brand-300">
              {option.count}
            </span>
          </button>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {selectedOption.resultLabel}
      </p>

      <ul
        key={selected}
        className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5"
      >
        {visibleItems.map((item, index) => (
          <li
            key={item.slug}
            style={
              { "--index": Math.min(index, MAX_STAGGER) } as React.CSSProperties
            }
            className={cn(hasFiltered && "brand-card-enter")}
          >
            {item.card}
          </li>
        ))}
      </ul>
    </>
  );
}
