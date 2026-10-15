import { cn } from "@/lib/utils";

function emptyCellCount(itemCount: number, columns: number) {
  return (columns - (itemCount % columns)) % columns;
}

interface GridColumns {
  base: number;
  md: number;
  xl: number;
}

interface GridFillersProps {
  itemCount: number;
  columns: GridColumns;
}

export function GridFillers({ itemCount, columns }: GridFillersProps) {
  const baseCount = emptyCellCount(itemCount, columns.base);
  const mdCount = emptyCellCount(itemCount, columns.md);
  const xlCount = emptyCellCount(itemCount, columns.xl);
  const fillerCount = Math.max(baseCount, mdCount, xlCount);

  return Array.from({ length: fillerCount }, (_, index) => (
    <li
      key={`filler-${index}`}
      aria-hidden
      className={cn(
        "bg-paper",
        index < baseCount ? "block" : "hidden",
        index < mdCount ? "md:block" : "md:hidden",
        index < xlCount ? "xl:block" : "xl:hidden",
      )}
    />
  ));
}
