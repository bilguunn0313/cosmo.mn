import { getTranslations } from "next-intl/server";
import { FadeInImage } from "@/components/site/fade-in-image";
import { Reveal } from "@/components/site/reveal";
import type { PublicMilestone } from "@/lib/public-api";
import { cn } from "@/lib/utils";
import {
  columnPath,
  DRAW_MS,
  groupByYear,
  type HistoryBrand,
  type HistoryPath,
  type HistoryStop,
  rowsPath,
} from "./history-path";
import { HistorySnake } from "./history-snake";

interface PathSize {
  track: number;
  line: number;
  pin: number;
}

const ROWS_SIZE: PathSize = { track: 12, line: 4, pin: 10 };
const COLUMN_SIZE: PathSize = { track: 9, line: 3, pin: 7 };
const START_DOT = 7;

function percent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

function delayStyle(stop: HistoryStop) {
  return { "--delay": `${stop.delay}ms` } as React.CSSProperties;
}

function highlight(chunks: React.ReactNode) {
  return <span className="text-brand">{chunks}</span>;
}

interface PathArtProps {
  path: HistoryPath;
  size: PathSize;
}

function PathArt({ path, size }: PathArtProps) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${path.width} ${path.height}`}
      className="absolute inset-0 size-full overflow-visible"
    >
      <path
        d={path.line}
        strokeWidth={size.track}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fill-none stroke-brand-100"
      />
      <path
        d={path.line}
        pathLength={1}
        strokeWidth={size.line}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="history-progress fill-none stroke-brand"
      />
      <circle
        cx={path.start.x}
        cy={path.start.y}
        r={START_DOT}
        className="fill-brand"
      />
      {path.stops.map((stop) => (
        <g key={stop.year}>
          <circle
            cx={stop.x}
            cy={stop.y}
            r={size.pin}
            strokeWidth={size.line}
            className="fill-white stroke-brand"
          />
          <circle
            cx={stop.x}
            cy={stop.y}
            r={size.pin}
            style={delayStyle(stop)}
            className="history-pin fill-coral"
          />
        </g>
      ))}
    </svg>
  );
}

interface BrandTileProps {
  brand: HistoryBrand;
  isCompact?: boolean;
}

function BrandTile({ brand, isCompact = false }: BrandTileProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-[10px] bg-white ring-1 ring-rule",
        isCompact ? "h-11 w-16" : "h-14 w-21",
      )}
    >
      {brand.imageUrl && (
        <FadeInImage
          src={brand.imageUrl}
          alt=""
          fill
          unoptimized
          sizes="84px"
          className={cn("object-contain", isCompact ? "p-1.5" : "p-2")}
        />
      )}
    </div>
  );
}

interface BrandListProps {
  stop: HistoryStop;
  isCompact?: boolean;
  isAbove?: boolean;
  className?: string;
}

function BrandList({
  stop,
  isCompact = false,
  isAbove = false,
  className,
}: BrandListProps) {
  return (
    <ul
      className={cn(
        "history-label absolute flex w-max",
        isCompact ? "gap-1.5" : "gap-2",
        isAbove && "items-end",
        className,
      )}
    >
      {stop.brands.map((brand) => (
        <li
          key={brand.id}
          className={cn(
            "flex items-center gap-1.5",
            isCompact ? "w-16" : "w-21",
            isAbove ? "flex-col-reverse" : "flex-col",
          )}
        >
          <BrandTile brand={brand} isCompact={isCompact} />
          {brand.title && (
            <p
              className={cn(
                "text-center leading-[1.3] text-ink-2",
                isCompact ? "text-xs" : "text-[13px]",
              )}
            >
              {brand.title}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function RowsTimeline({ path }: { path: HistoryPath }) {
  return (
    <HistorySnake
      width={path.width}
      height={path.height}
      drawMs={DRAW_MS}
      className="mx-auto max-w-300 max-lg:hidden"
    >
      <PathArt path={path} size={ROWS_SIZE} />
      <ol aria-labelledby="history-title">
        {path.stops.map((stop, index) => {
          const isBelow = index % 2 === 0;

          return (
            <li
              key={stop.year}
              style={{
                ...delayStyle(stop),
                left: percent(stop.x, path.width),
                top: percent(stop.y, path.height),
              }}
              className="absolute size-0"
            >
              <p
                className={cn(
                  "history-label absolute w-max -translate-x-1/2 font-display text-[30px] leading-none font-semibold tracking-[-0.02em] text-brand tabular-nums",
                  isBelow
                    ? "-translate-y-[calc(100%+22px)]"
                    : "translate-y-5.5",
                )}
              >
                {stop.year}
              </p>
              <BrandList
                stop={stop}
                isAbove={!isBelow}
                className={cn(
                  "-translate-x-1/2",
                  isBelow
                    ? "translate-y-6.5"
                    : "-translate-y-[calc(100%+26px)]",
                )}
              />
            </li>
          );
        })}
      </ol>
    </HistorySnake>
  );
}

function ColumnTimeline({ path }: { path: HistoryPath }) {
  return (
    <HistorySnake
      width={path.width}
      height={path.height}
      drawMs={DRAW_MS}
      className="mx-auto max-w-sm lg:hidden"
    >
      <PathArt path={path} size={COLUMN_SIZE} />
      <ol aria-labelledby="history-title">
        {path.stops.map((stop, index) => {
          const brandsOnRight = index % 2 === 0;

          return (
            <li
              key={stop.year}
              style={{ ...delayStyle(stop), top: percent(stop.y, path.height) }}
              className="absolute left-1/2 size-0"
            >
              <p
                className={cn(
                  "history-label absolute w-max -translate-y-1/2 font-display text-xl leading-none font-semibold text-brand tabular-nums",
                  brandsOnRight ? "right-6" : "left-6",
                )}
              >
                {stop.year}
              </p>
              <BrandList
                stop={stop}
                isCompact
                className={cn(
                  "-translate-y-5.5",
                  brandsOnRight ? "left-6" : "right-6",
                )}
              />
            </li>
          );
        })}
      </ol>
    </HistorySnake>
  );
}

interface HistoryTimelineProps {
  milestones: PublicMilestone[];
}

export async function HistoryTimeline({ milestones }: HistoryTimelineProps) {
  const t = await getTranslations("about");
  const years = groupByYear(milestones);

  if (years.length === 0) {
    return null;
  }

  return (
    <section
      id="history"
      aria-labelledby="history-title"
      className="scroll-mt-24 overflow-x-clip pt-14 pb-16 md:pt-20 md:pb-22 lg:pt-24 lg:pb-26"
    >
      <div className="site-container">
        <Reveal className="mb-6 md:text-center">
          <h2 id="history-title" className="type-section text-balance text-ink">
            {t.rich("historyHeading", { highlight })}
          </h2>
        </Reveal>
        <RowsTimeline path={rowsPath(years)} />
        <ColumnTimeline path={columnPath(years)} />
      </div>
    </section>
  );
}
