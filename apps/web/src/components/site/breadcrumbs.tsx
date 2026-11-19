import { getTranslations } from "next-intl/server";
import { Fragment } from "react";
import { Link } from "@/i18n/navigation";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

export async function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const t = await getTranslations("nav");

  return (
    <nav aria-label={t("breadcrumb")} className={className}>
      <ol className="flex flex-wrap items-center gap-2.5 text-sm text-ink-2">
        {items.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 && <li aria-hidden>/</li>}
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors duration-150 hover:text-brand-700"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-ink">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
