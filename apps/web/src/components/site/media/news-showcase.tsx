"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const STAGE_ID = "news-stage";

interface ShowcaseItem {
  id: string;
  slide: React.ReactNode;
  thumb: React.ReactNode;
}

interface NewsShowcaseProps {
  items: ShowcaseItem[];
  stripLabel: string;
}

export function NewsShowcase({ items, stripLabel }: NewsShowcaseProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  return (
    <div>
      <div id={STAGE_ID} className="grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "col-start-1 row-start-1 transition-[opacity,visibility] ease-out motion-reduce:transition-none",
              item.id === activeId
                ? "visible opacity-100 delay-100 duration-250"
                : "invisible opacity-0 duration-100",
            )}
          >
            {item.slide}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="mt-10 border-t border-rule pt-4 md:mt-12">
          <ul
            aria-label={stripLabel}
            className="-mx-2 flex snap-x scroll-px-2 gap-4 overflow-x-auto px-2 pt-2 pb-3 md:gap-5"
          >
            {items.map((item) => (
              <li key={item.id} className="w-40 flex-none snap-start md:w-55">
                <button
                  type="button"
                  aria-pressed={item.id === activeId}
                  aria-controls={STAGE_ID}
                  onClick={() => setActiveId(item.id)}
                  className="group/thumb grid w-full cursor-pointer gap-2.5 rounded-xl text-left outline-offset-4 outline-brand transition-[scale] duration-160 ease-out focus-visible:outline-2 active:scale-[0.98] motion-reduce:transition-none"
                >
                  {item.thumb}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
