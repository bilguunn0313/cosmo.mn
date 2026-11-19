import { getFormatter } from "next-intl/server";
import { cn } from "@/lib/utils";

const DATE_FORMATS = {
  long: { year: "numeric", month: "long", day: "numeric" },
  short: { year: "numeric", month: "2-digit", day: "2-digit" },
  month: { year: "numeric", month: "short" },
} as const;

interface NewsDateProps {
  publishedAt: string;
  variant?: keyof typeof DATE_FORMATS;
  className?: string;
}

export async function NewsDate({
  publishedAt,
  variant = "long",
  className,
}: NewsDateProps) {
  const format = await getFormatter();

  return (
    <time dateTime={publishedAt} className={cn("tabular-nums", className)}>
      {format.dateTime(new Date(publishedAt), DATE_FORMATS[variant])}
    </time>
  );
}
