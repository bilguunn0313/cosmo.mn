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
    <nav aria-label={t("brands.filterLabel")}>
      <ul className="flex flex-wrap gap-2">
        {options.map(({ category, count }) => (
          <li key={category ?? "all"}>
            <Link
              href={{
                pathname: "/brands",
                query: category ? { category } : {},
              }}
              scroll={false}
              aria-current={category === activeCategory ? "page" : undefined}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-card px-5 text-[15px] font-medium text-foreground/75 transition-[background-color,color,scale] duration-150 ease-(--ease-out) hover:text-foreground motion-safe:active:scale-[0.97] aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
            >
              {category ? t(`categories.${category}`) : t("brands.all")}
              <span className="text-sm tabular-nums opacity-60">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
