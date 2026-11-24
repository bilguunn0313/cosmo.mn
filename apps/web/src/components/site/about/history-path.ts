import type { PublicMilestone } from "@/lib/public-api";

export const DRAW_MS = 3400;

const ROW_COLUMNS = [170, 385, 600, 815, 1030];
const ROW_WIDTH = 1200;
const ROW_LINE_START = 56;
const FIRST_ROW = 156;
const ROW_GAP = 300;
const TURN_RADIUS = ROW_GAP / 2;
const ROW_BOTTOM_SPACE = 150;

const COLUMN_WIDTH = 358;
const COLUMN_CENTER = COLUMN_WIDTH / 2;
const COLUMN_LINE_START = 8;
const COLUMN_FIRST_STOP = 56;
const COLUMN_STEP = 118;
const COLUMN_SWING = 16;
const COLUMN_BOTTOM_SPACE = 84;

export interface HistoryBrand {
  id: number;
  title: string;
  imageUrl: string | null;
}

export interface HistoryYear {
  year: number;
  brands: HistoryBrand[];
}

export interface HistoryStop extends HistoryYear {
  x: number;
  y: number;
  delay: number;
}

export interface HistoryPath {
  width: number;
  height: number;
  line: string;
  start: { x: number; y: number };
  stops: HistoryStop[];
}

interface Row {
  y: number;
  startX: number;
  endX: number;
  startDistance: number;
}

export function groupByYear(milestones: PublicMilestone[]) {
  const sorted = [...milestones].sort((a, b) => a.year - b.year);
  const years: HistoryYear[] = [];

  for (const milestone of sorted) {
    const brand = {
      id: milestone.id,
      title: milestone.title,
      imageUrl: milestone.imageUrl,
    };
    const current = years.at(-1);

    if (current?.year === milestone.year) {
      current.brands.push(brand);
    } else {
      years.push({ year: milestone.year, brands: [brand] });
    }
  }

  return years;
}

function delayFor(distance: number, total: number) {
  return total > 0 ? Math.round((distance / total) * DRAW_MS) : 0;
}

function rowPoint(index: number) {
  const perRow = ROW_COLUMNS.length;
  const row = Math.floor(index / perRow);
  const column = index % perRow;
  const x =
    row % 2 === 0 ? ROW_COLUMNS[column] : ROW_COLUMNS[perRow - 1 - column];

  return { row, x, y: FIRST_ROW + row * ROW_GAP };
}

export function rowsPath(years: HistoryYear[]): HistoryPath {
  const left = ROW_COLUMNS[0];
  const right = ROW_COLUMNS[ROW_COLUMNS.length - 1];
  const points = years.map((_, index) => rowPoint(index));
  const last = points[points.length - 1];
  const rows: Row[] = [];
  let line = `M${ROW_LINE_START} ${FIRST_ROW}`;
  let distance = 0;

  for (let row = 0; row <= last.row; row += 1) {
    const y = FIRST_ROW + row * ROW_GAP;
    const goesRight = row % 2 === 0;
    const isLastRow = row === last.row;
    const startX = row === 0 ? ROW_LINE_START : goesRight ? left : right;
    const endX = isLastRow ? last.x : goesRight ? right : left;

    rows.push({ y, startX, endX, startDistance: distance });
    line += ` L${endX} ${y}`;
    distance += Math.abs(endX - startX);

    if (!isLastRow) {
      const sweep = goesRight ? 1 : 0;
      line += ` A${TURN_RADIUS} ${TURN_RADIUS} 0 0 ${sweep} ${endX} ${y + ROW_GAP}`;
      distance += Math.PI * TURN_RADIUS;
    }
  }

  const stops = years.map((year, index) => {
    const { row, x, y } = points[index];
    const along = rows[row].startDistance + Math.abs(x - rows[row].startX);

    return { ...year, x, y, delay: delayFor(along, distance) };
  });

  return {
    width: ROW_WIDTH,
    height: last.y + ROW_BOTTOM_SPACE,
    line,
    start: { x: ROW_LINE_START, y: FIRST_ROW },
    stops,
  };
}

export function columnPath(years: HistoryYear[]): HistoryPath {
  const lastY = COLUMN_FIRST_STOP + (years.length - 1) * COLUMN_STEP;
  const total = lastY - COLUMN_LINE_START;
  let line = `M${COLUMN_CENTER} ${COLUMN_LINE_START} L${COLUMN_CENTER} ${COLUMN_FIRST_STOP}`;

  for (let index = 1; index < years.length; index += 1) {
    const fromY = COLUMN_FIRST_STOP + (index - 1) * COLUMN_STEP;
    const swing = index % 2 === 1 ? COLUMN_SWING : -COLUMN_SWING;
    const firstHandle = `${COLUMN_CENTER + swing} ${fromY + COLUMN_STEP * 0.35}`;
    const secondHandle = `${COLUMN_CENTER - swing} ${fromY + COLUMN_STEP * 0.65}`;

    line += ` C${firstHandle} ${secondHandle} ${COLUMN_CENTER} ${fromY + COLUMN_STEP}`;
  }

  const stops = years.map((year, index) => {
    const y = COLUMN_FIRST_STOP + index * COLUMN_STEP;

    return {
      ...year,
      x: COLUMN_CENTER,
      y,
      delay: delayFor(y - COLUMN_LINE_START, total),
    };
  });

  return {
    width: COLUMN_WIDTH,
    height: lastY + COLUMN_BOTTOM_SPACE,
    line,
    start: { x: COLUMN_CENTER, y: COLUMN_LINE_START },
    stops,
  };
}
