import type { BrandCategory } from "@cosmo/shared";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

interface FilterOption {
  category: BrandCategory | null;
  count: number;
}

interface CategoryFilterProps {
  options: FilterOption[];
  activeCategory: BrandCategory | null;
}

export async function CategoryFilter({
  options,
  activeCategory,
}: CategoryFilterProps) {
  const t = await getTranslations();

  return (
    <nav
      aria-label={t("brands.filterLabel")}
      className="no-scrollbar -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0"
    >
      <ul className="flex gap-2">
        {options.map(({ category, count }) => (
          <li key={category ?? "all"}>
            <Link
              href={{
                pathname: "/brands",
                query: category ? { category } : {},
              }}
              scroll={false}
              aria-current={category === activeCategory ? "page" : undefined}
              className="group inline-flex h-11 items-center gap-2 rounded-control bg-surface px-4 text-[15px] font-medium whitespace-nowrap text-ink transition-colors duration-200 hover:bg-brand-100 aria-[current=page]:bg-brand aria-[current=page]:text-white md:px-5"
            >
              {category ? t(`categories.${category}`) : t("brands.all")}
              <span className="text-[13px] font-semibold text-ink-3 tabular-nums group-aria-[current=page]:text-brand-200">
                {count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
