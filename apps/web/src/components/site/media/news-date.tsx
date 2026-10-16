import { getFormatter } from "next-intl/server";
import { cn } from "@/lib/utils";

const DATE_FORMAT = {
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

interface NewsDateProps {
  publishedAt: string;
  className?: string;
}

export async function NewsDate({ publishedAt, className }: NewsDateProps) {
  const format = await getFormatter();

  return (
    <time
      dateTime={publishedAt}
      className={cn("tabular-nums", className)}
    >
      {format.dateTime(new Date(publishedAt), DATE_FORMAT)}
    </time>
  );
}
