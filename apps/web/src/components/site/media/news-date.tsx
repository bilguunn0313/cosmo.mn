import { getFormatter } from "next-intl/server";
import { cn } from "@/lib/utils";

const LONG_DATE_FORMAT = {
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

const SHORT_DATE_FORMAT = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
} as const;

interface NewsDateProps {
  publishedAt: string;
  isShort?: boolean;
  className?: string;
}

export async function NewsDate({
  publishedAt,
  isShort = false,
  className,
}: NewsDateProps) {
  const format = await getFormatter();

  return (
    <time dateTime={publishedAt} className={cn("tabular-nums", className)}>
      {format.dateTime(
        new Date(publishedAt),
        isShort ? SHORT_DATE_FORMAT : LONG_DATE_FORMAT,
      )}
    </time>
  );
}
