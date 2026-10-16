import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const stepClass =
  "inline-flex h-12 items-center justify-between gap-3 border-2 border-rule px-4 text-[15px] font-medium transition-colors duration-200 hover:bg-brand-100 md:min-w-36";

interface NewsPaginationProps {
  page: number;
  totalPages: number;
  query?: Record<string, string>;
}

export async function NewsPagination({
  page,
  totalPages,
  query = {},
}: NewsPaginationProps) {
  const t = await getTranslations("media");

  if (totalPages <= 1) {
    return null;
  }

  const href = (p: number) => ({
    pathname: "/media",
    query: { ...query, ...(p > 1 ? { page: String(p) } : {}) },
  });
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label={t("pagination")}
      className="flex items-center justify-between gap-4"
    >
      {page > 1 ? (
        <Link href={href(page - 1)} className={stepClass}>
          <ArrowLeft className="size-[18px]" />
          <span className="hidden sm:inline">{t("previous")}</span>
        </Link>
      ) : (
        <span aria-hidden className={cn(stepClass, "invisible")} />
      )}

      <ul className="hidden gap-0.5 sm:flex">
        {pages.map((p) => (
          <li key={p}>
            <Link
              href={href(p)}
              aria-current={p === page ? "page" : undefined}
              className="grid size-12 place-items-center text-[15px] font-semibold tabular-nums transition-colors duration-200 hover:bg-brand-200 aria-[current=page]:bg-brand aria-[current=page]:text-white"
            >
              {p}
            </Link>
          </li>
        ))}
      </ul>
      <span className="text-[15px] text-ink-2 tabular-nums sm:hidden">
        {t("pageOf", { page, total: totalPages })}
      </span>

      {page < totalPages ? (
        <Link href={href(page + 1)} className={stepClass}>
          <span className="hidden sm:inline">{t("next")}</span>
          <ArrowRight className="size-[18px]" />
        </Link>
      ) : (
        <span aria-hidden className={cn(stepClass, "invisible")} />
      )}
    </nav>
  );
}
