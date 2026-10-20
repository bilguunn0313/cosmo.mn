"use client";

import type { BrandCategory } from "@cosmo/shared";
import { ArrowDownRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BrandTile } from "@/components/site/brands/brand-tile";
import type { PublicBrand } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const CARD_STAGGER_SECONDS = 0.05;
const MAX_STAGGERED_CARDS = 6;
const PAGE_SCROLL_RATIO = 0.8;

export interface CategoryTile {
  category: BrandCategory;
  imageUrl: string | null;
}

interface ScrollState {
  canScrollBack: boolean;
  canScrollForward: boolean;
}

function readScrollState(track: HTMLElement): ScrollState {
  const maxScroll = track.scrollWidth - track.clientWidth;

  return {
    canScrollBack: track.scrollLeft > 1,
    canScrollForward: track.scrollLeft < maxScroll - 1,
  };
}

interface CategoryButtonProps {
  label: string;
  imageUrl: string | null;
  isActive: boolean;
  onClick: () => void;
}

function CategoryButton({
  label,
  imageUrl,
  isActive,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className="group relative flex h-24 w-[min(44vw,220px)] shrink-0 snap-start overflow-hidden rounded-card bg-brand-900 p-4 text-left text-white outline-offset-4 outline-brand focus-visible:outline-2 md:h-36 md:w-auto md:p-5"
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 768px) 25vw, 44vw"
          className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
        />
      )}
      <span
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-black/60 to-black/5"
      />
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 bg-brand transition-opacity duration-300 ease-out",
          isActive ? "opacity-90" : "opacity-0",
        )}
      />
      <span className="relative type-h4">{label}</span>
      <ArrowDownRight
        aria-hidden
        className={cn(
          "absolute right-4 bottom-4 size-5 transition-[opacity,translate] duration-300 ease-out md:right-5 md:bottom-5 md:size-6",
          isActive ? "opacity-100" : "-translate-x-1 -translate-y-1 opacity-0",
        )}
      />
    </button>
  );
}

interface ArrowButtonProps {
  label: string;
  isDisabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ArrowButton({
  label,
  isDisabled,
  onClick,
  children,
}: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={isDisabled}
      onClick={onClick}
      className="flex size-13 items-center justify-center rounded-control border border-ink-3 transition-[background-color,opacity] duration-150 hover:bg-brand-100 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

interface BrandShowcaseProps {
  brands: PublicBrand[];
  tiles: CategoryTile[];
}

export function BrandShowcase({ brands, tiles }: BrandShowcaseProps) {
  const t = useTranslations();
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<BrandCategory | null>(
    null,
  );
  const [scrollState, setScrollState] = useState<ScrollState>({
    canScrollBack: false,
    canScrollForward: false,
  });

  const visibleBrands = activeCategory
    ? brands.filter((brand) => brand.categories.includes(activeCategory))
    : brands;

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setScrollState(readScrollState(track));
    });
    observer.observe(track);

    return () => observer.disconnect();
  }, [activeCategory]);

  const selectCategory = (category: BrandCategory | null) => {
    setActiveCategory(category);
    trackRef.current?.scrollTo({ left: 0 });
  };

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    track.scrollBy({
      left: direction * track.clientWidth * PAGE_SCROLL_RATIO,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const categoryOptions = [
    { category: null, label: t("brands.all"), imageUrl: null },
    ...tiles.map((tile) => ({
      category: tile.category,
      label: t(`categories.${tile.category}`),
      imageUrl: tile.imageUrl,
    })),
  ];

  const canScroll = scrollState.canScrollBack || scrollState.canScrollForward;

  return (
    <>
      <div className="site-container">
        <div
          role="group"
          aria-label={t("brands.filterLabel")}
          className="no-scrollbar -mx-4 mt-6 flex snap-x gap-2 overflow-x-auto px-4 md:mx-0 md:grid md:auto-cols-fr md:grid-flow-col md:gap-3 md:overflow-visible md:px-0"
        >
          {categoryOptions.map((option) => (
            <CategoryButton
              key={option.category ?? "all"}
              label={option.label}
              imageUrl={option.imageUrl}
              isActive={option.category === activeCategory}
              onClick={() => selectCategory(option.category)}
            />
          ))}
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={(event) =>
          setScrollState(readScrollState(event.currentTarget))
        }
        tabIndex={0}
        aria-label={t("home.categoriesTitle")}
        className="bleed-gutter no-scrollbar mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto outline-offset-4 outline-brand focus-visible:outline-2 md:mt-10 md:gap-4"
      >
        {visibleBrands.map((brand, index) => (
          <motion.div
            key={`${activeCategory ?? "all"}-${brand.slug}`}
            initial={{
              opacity: 0,
              transform: `translateY(${shouldReduceMotion ? 0 : 20}px)`,
            }}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.5,
              delay:
                Math.min(index, MAX_STAGGERED_CARDS) * CARD_STAGGER_SECONDS,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="w-[min(70vw,320px)] shrink-0 snap-start"
          >
            <BrandTile
              brand={brand}
              meta={brand.categories
                .map((category) => t(`categories.${category}`))
                .join(", ")}
            />
          </motion.div>
        ))}
      </div>

      {canScroll && (
        <div className="site-container mt-6 hidden justify-end gap-0.5 md:flex">
          <ArrowButton
            label={t("home.previous")}
            isDisabled={!scrollState.canScrollBack}
            onClick={() => scrollByPage(-1)}
          >
            <ChevronLeft className="size-5" />
          </ArrowButton>
          <ArrowButton
            label={t("home.next")}
            isDisabled={!scrollState.canScrollForward}
            onClick={() => scrollByPage(1)}
          >
            <ChevronRight className="size-5" />
          </ArrowButton>
        </div>
      )}
    </>
  );
}
