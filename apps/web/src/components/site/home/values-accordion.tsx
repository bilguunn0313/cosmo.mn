"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ValueItem {
  key: string;
  title: string;
  text: string;
  imageUrl: string;
}

interface ValuesAccordionProps {
  values: ValueItem[];
}

export function ValuesAccordion({ values }: ValuesAccordionProps) {
  const [activeKey, setActiveKey] = useState(values[0]?.key);

  return (
    <ul className="flex h-155 flex-col gap-2.5 md:h-115 md:flex-row md:gap-3">
      {values.map((value) => {
        const isActive = value.key === activeKey;

        return (
          <li
            key={value.key}
            className={cn(
              "flex min-h-0 min-w-0 basis-0 transition-[flex-grow] duration-700 ease-out motion-reduce:transition-none",
              isActive ? "grow-[3.2]" : "grow",
            )}
          >
            <button
              type="button"
              aria-expanded={isActive}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") {
                  setActiveKey(value.key);
                }
              }}
              onFocus={() => setActiveKey(value.key)}
              onClick={() => setActiveKey(value.key)}
              className="relative isolate size-full overflow-hidden rounded-card bg-brand-night text-left text-white outline-offset-4 outline-brand focus-visible:outline-2"
            >
              <Image
                src={value.imageUrl}
                alt=""
                fill
                unoptimized
                sizes="(min-width: 768px) 60vw, 100vw"
                className={cn(
                  "-z-20 object-cover transition-[filter] duration-700 ease-out motion-reduce:transition-none",
                  !isActive && "brightness-85 saturate-80",
                )}
              />
              <span
                aria-hidden
                className="absolute inset-0 -z-10 bg-linear-to-t from-brand-night/85 via-brand-night/20 to-brand-night/5"
              />

              <span className="absolute inset-x-5 bottom-5 grid gap-2 md:inset-x-6 md:bottom-6">
                <span className="type-h4 text-balance">{value.title}</span>
                <span
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none",
                    isActive
                      ? "grid-rows-[1fr] opacity-100 delay-150"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <span className="overflow-hidden">
                    <span className="block max-w-120 text-base text-pretty text-white/90">
                      {value.text}
                    </span>
                  </span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
