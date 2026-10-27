"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/reveal";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const DRAG_THRESHOLD_PX = 4;

interface DragState {
  startX: number;
  startScroll: number;
  hasMoved: boolean;
}

interface NewsRailProps {
  titleId: string;
  title: string;
  labels: {
    previous: string;
    next: string;
    allNews: string;
  };
  children: React.ReactNode;
}

export function NewsRail({ titleId, title, labels, children }: NewsRailProps) {
  const shouldReduceMotion = useReducedMotion();
  const railRef = useRef<HTMLUListElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const wasDraggedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const scrollBehavior = shouldReduceMotion ? "auto" : "smooth";

  const updateScrollState = () => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    setCanScrollBack(rail.scrollLeft > 2);
    setCanScrollForward(
      rail.scrollLeft < rail.scrollWidth - rail.clientWidth - 2,
    );
  };

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(rail);

    return () => observer.disconnect();
  });

  const cardStep = () => {
    const rail = railRef.current;
    const firstItem = rail?.firstElementChild;

    if (!rail || !(firstItem instanceof HTMLElement)) {
      return 0;
    }

    return firstItem.offsetWidth + parseFloat(getComputedStyle(rail).columnGap);
  };

  const scrollByCards = (direction: 1 | -1) => {
    railRef.current?.scrollBy({
      left: direction * cardStep(),
      behavior: scrollBehavior,
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse" || !railRef.current) {
      return;
    }

    dragRef.current = {
      startX: event.clientX,
      startScroll: railRef.current.scrollLeft,
      hasMoved: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLUListElement>) => {
    const drag = dragRef.current;
    const rail = railRef.current;

    if (!drag || !rail) {
      return;
    }

    const distance = event.clientX - drag.startX;

    if (!drag.hasMoved && Math.abs(distance) > DRAG_THRESHOLD_PX) {
      drag.hasMoved = true;
      rail.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }

    if (drag.hasMoved) {
      rail.scrollLeft = drag.startScroll - distance;
    }
  };

  const handlePointerEnd = () => {
    const drag = dragRef.current;
    const rail = railRef.current;
    dragRef.current = null;

    if (!drag?.hasMoved || !rail) {
      return;
    }

    wasDraggedRef.current = true;
    setTimeout(() => {
      wasDraggedRef.current = false;
    });
    setIsDragging(false);
    const step = cardStep();
    rail.scrollTo({
      left: Math.round(rail.scrollLeft / step) * step,
      behavior: scrollBehavior,
    });
  };

  const handleClickCapture = (event: React.MouseEvent) => {
    if (wasDraggedRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const hasOverflow = canScrollBack || canScrollForward;

  return (
    <>
      <div className="site-container flex flex-wrap items-end justify-between gap-4 pb-5 md:pb-6">
        <h2 id={titleId} className="type-h2 text-balance">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          {hasOverflow && (
            <div className="hidden gap-2 md:flex">
              <RailButton
                label={labels.previous}
                isDisabled={!canScrollBack}
                onClick={() => scrollByCards(-1)}
              >
                <ChevronLeft className="size-5" />
              </RailButton>
              <RailButton
                label={labels.next}
                isDisabled={!canScrollForward}
                onClick={() => scrollByCards(1)}
              >
                <ChevronRight className="size-5" />
              </RailButton>
            </div>
          )}
          <Link
            href="/media"
            className="group inline-flex items-center gap-2 px-1 py-2 text-sm font-semibold text-brand-700"
          >
            {labels.allNews}
            <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <Reveal>
        <ul
          ref={railRef}
          onScroll={updateScrollState}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onClickCapture={handleClickCapture}
          onDragStart={(event) => event.preventDefault()}
          className={cn(
            "no-scrollbar bleed-gutter mt-1 grid auto-cols-[80%] grid-flow-col gap-4 overflow-x-auto md:auto-cols-[45%] md:gap-5 lg:auto-cols-[340px]",
            isDragging
              ? "cursor-grabbing select-none"
              : "cursor-grab snap-x snap-mandatory",
          )}
        >
          {children}
        </ul>
      </Reveal>
    </>
  );
}

interface RailButtonProps {
  label: string;
  isDisabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function RailButton({ label, isDisabled, onClick, children }: RailButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={isDisabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full bg-paper text-brand transition-[background-color,opacity,scale] duration-160 ease-out hover:bg-brand-100 active:scale-[0.94] disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}
