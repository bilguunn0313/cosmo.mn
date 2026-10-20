import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteButtonClass } from "@/components/site/site-button";
import { Link } from "@/i18n/navigation";

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
      className="grid grid-cols-[1fr_auto_1fr] items-center gap-4"
    >
      {page > 1 ? (
        <Link
          href={pageHref(page - 1)}
          className={siteButtonClass("secondary", "group justify-self-start")}
        >
          <ArrowLeft className="size-4.5 transition-[translate] duration-200 ease-out group-hover:-translate-x-0.5" />
          {t("previous")}
        </Link>
      ) : (
        <span aria-hidden />
      )}
      <span className="text-sm font-semibold text-ink-3 tabular-nums">
        {t("pageOf", { page, total: totalPages })}
      </span>
      {page < totalPages ? (
        <Link
          href={pageHref(page + 1)}
          className={siteButtonClass("secondary", "group justify-self-end")}
        >
          {t("next")}
          <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  );
}
