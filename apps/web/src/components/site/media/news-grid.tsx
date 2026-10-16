import { GridFillers } from "@/components/site/grid-fillers";
import { Reveal } from "@/components/site/reveal";
import type { PublicNewsItem } from "@/lib/public-api";
import { NewsCard } from "./news-card";

const GRID_COLUMNS = { base: 1, md: 2, xl: 3 };

interface NewsGridProps {
  items: PublicNewsItem[];
}

export function NewsGrid({ items }: NewsGridProps) {
  return (
    <ul className="grid gap-px border border-rule bg-rule md:grid-cols-2 xl:grid-cols-3">
      {items.map((news, index) => (
        <li key={news.slug} className="bg-paper">
          <Reveal index={index % GRID_COLUMNS.xl} className="h-full">
            <NewsCard news={news} />
          </Reveal>
        </li>
      ))}
      <GridFillers itemCount={items.length} columns={GRID_COLUMNS} />
    </ul>
  );
}
