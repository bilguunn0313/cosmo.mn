"use client";

import Image from "next/image";
import { useState } from "react";
import type { PublicProduct } from "@/lib/public-api";
import { cn } from "@/lib/utils";
import { BRAND_TILE_BACKGROUND } from "./brand-tile-background";

interface ProductViewerProps {
  products: PublicProduct[];
  pickerLabel: string;
}

export function ProductViewer({ products, pickerLabel }: ProductViewerProps) {
  const [selectedId, setSelectedId] = useState(products[0].id);
  const selected =
    products.find((product) => product.id === selectedId) ?? products[0];

  return (
    <>
      <div className="grid items-center gap-8 lg:grid-cols-[6fr_5fr] lg:gap-14">
        <div
          key={selected.id}
          className={cn(
            "relative aspect-square animate-in overflow-hidden rounded-[24px] duration-300 fade-in motion-reduce:animate-none",
            BRAND_TILE_BACKGROUND,
          )}
        >
          <Image
            src={selected.imageUrl}
            alt={selected.name}
            fill
            unoptimized
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-contain p-[17%] mix-blend-multiply"
          />
        </div>

        <div
          key={`copy-${selected.id}`}
          aria-live="polite"
          className="grid animate-in justify-items-start gap-3.5 duration-300 fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
        >
          <h3 className="type-display text-ink">{selected.name}</h3>
          {selected.description && (
            <p className="text-base leading-relaxed text-pretty whitespace-pre-line text-ink-2">
              {selected.description}
            </p>
          )}
        </div>
      </div>

      {products.length > 1 && (
        <ul
          aria-label={pickerLabel}
          className="mt-7 grid grid-cols-4 gap-2.5 sm:grid-cols-6 lg:grid-cols-8"
        >
          {products.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                aria-label={product.name}
                aria-pressed={product.id === selected.id}
                onClick={() => setSelectedId(product.id)}
                className="relative block aspect-square w-full overflow-hidden rounded-[14px] bg-white shadow-[inset_0_0_0_2px_transparent] outline-offset-2 outline-brand transition-[translate,box-shadow] duration-200 ease-(--ease-out) hover:-translate-y-0.5 focus-visible:outline-2 aria-pressed:shadow-[inset_0_0_0_2px_var(--color-brand)] motion-reduce:transition-none"
              >
                <Image
                  src={product.imageUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-contain p-[18%] mix-blend-multiply"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
