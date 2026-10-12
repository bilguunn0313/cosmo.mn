import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const pillClass =
  "inline-flex h-11 items-center gap-1.5 rounded-full bg-card px-5 text-[15px] font-medium transition-[color,scale] duration-150 ease-(--ease-out) hover:text-primary motion-safe:active:scale-[0.97]";

function pageHref(page: number) {
  return { pathname: "/media", query: page > 1 ? { page } : {} };
}

interface NewsPaginationProps {
  page: number;
  totalPages: number;
}

export async function NewsPagination({
  page,
  totalPages,
}: NewsPaginationProps) {
  const t = await getTranslations("media");

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label={t("pagination")}
      className="flex items-center justify-center gap-3"
    >
      {page > 1 ? (
        <Link href={pageHref(page - 1)} className={pillClass}>
          <ChevronLeft className="size-4" />
          {t("previous")}
        </Link>
      ) : (
        <span aria-hidden className={cn(pillClass, "invisible")} />
      )}
      <span className="min-w-20 text-center text-[15px] text-muted-foreground tabular-nums">
        {t("pageOf", { page, total: totalPages })}
      </span>
      {page < totalPages ? (
        <Link href={pageHref(page + 1)} className={pillClass}>
          {t("next")}
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span aria-hidden className={cn(pillClass, "invisible")} />
      )}
    </nav>
  );
}
