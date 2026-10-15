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
      className="no-scrollbar -mx-4 overflow-x-auto border-b-2 border-rule px-4 md:mx-0 md:px-0"
    >
      <ul className="flex gap-1">
        {options.map(({ category, count }) => (
          <li key={category ?? "all"}>
            <Link
              href={{
                pathname: "/brands",
                query: category ? { category } : {},
              }}
              scroll={false}
              aria-current={category === activeCategory ? "page" : undefined}
              className="-mb-0.5 inline-flex items-baseline gap-2 border-b-4 border-transparent px-3 pt-4 pb-3.5 text-base font-medium whitespace-nowrap text-ink transition-colors duration-200 hover:text-brand-700 aria-[current=page]:border-brand aria-[current=page]:text-brand-700 md:px-4 md:text-[17px]"
            >
              {category ? t(`categories.${category}`) : t("brands.all")}
              <span className="text-[13px] font-semibold text-ink-3 tabular-nums">
                {count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
