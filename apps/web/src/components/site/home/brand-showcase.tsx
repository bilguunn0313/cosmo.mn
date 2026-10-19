"use client";

import type { BrandCategory } from "@cosmo/shared";
import {
  ArrowDownRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { PublicBrand } from "@/lib/public-api";
import { brandPath } from "@/lib/site-links";
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

interface CardVisualProps {
  brand: PublicBrand;
}

function CardVisual({ brand }: CardVisualProps) {
  if (brand.showcaseImageUrl) {
    return (
      <>
        <Image
          src={brand.showcaseImageUrl}
          alt={brand.name}
          fill
          unoptimized
          sizes="320px"
          className="object-contain px-[14%] pt-[12%] pb-[22%] transition-[scale] duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
        />
        {brand.logoUrl && (
          <span className="absolute bottom-4 left-4 size-16 overflow-hidden rounded-full bg-white shadow-[0_4px_16px_color-mix(in_srgb,var(--color-brand-900)_14%,transparent)] md:size-18">
            <Image
              src={brand.logoUrl}
              alt=""
              fill
              unoptimized
              sizes="72px"
              className="object-contain p-2.5"
            />
          </span>
        )}
      </>
    );
  }

  if (brand.logoUrl) {
    return (
      <Image
        src={brand.logoUrl}
        alt={brand.name}
        fill
        unoptimized
        sizes="320px"
        className="object-contain p-[22%] mix-blend-multiply transition-[scale] duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none"
      />
    );
  }

  return (
    <span className="absolute inset-0 grid place-items-center p-8 text-center text-3xl font-semibold tracking-heading text-ink-3">
      {brand.name}
    </span>
  );
}

interface ShowcaseCardProps {
  brand: PublicBrand;
  categoryLabel: string;
}

function ShowcaseCard({ brand, categoryLabel }: ShowcaseCardProps) {
  return (
    <Link
      href={brandPath(brand.slug)}
      className="group flex h-full flex-col outline-offset-4 outline-brand focus-visible:outline-2"
    >
      <span className="relative block aspect-4/5 overflow-hidden rounded-card bg-[radial-gradient(circle_at_50%_45%,white_35%,var(--color-brand-100)_70%,var(--color-brand-200))]">
        <CardVisual brand={brand} />
      </span>
      <span className="flex items-center justify-between gap-3 pt-4">
        <span className="grid min-w-0 gap-1">
          <span className="type-h4 wrap-anywhere transition-colors duration-150 group-hover:text-brand-700">
            {brand.name}
          </span>
          <span className="text-[13px] font-semibold text-brand-700">
            {categoryLabel}
          </span>
        </span>
        <ArrowRight className="size-5 shrink-0 text-brand transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
      </span>
    </Link>
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
      className="flex size-13 items-center justify-center border border-ink-3 transition-[background-color,opacity] duration-150 hover:bg-brand-100 disabled:pointer-events-none disabled:opacity-30"
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
            <ShowcaseCard
              brand={brand}
              categoryLabel={brand.categories
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
