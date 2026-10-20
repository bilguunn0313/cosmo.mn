import { Reveal } from "@/components/site/reveal";
import type { PublicNewsItem } from "@/lib/public-api";
import { NewsCard } from "./news-card";

const REVEAL_COLUMNS = 3;

interface NewsGridProps {
  items: PublicNewsItem[];
}

export function NewsGrid({ items }: NewsGridProps) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((news, index) => (
        <li key={news.slug}>
          <Reveal index={index % REVEAL_COLUMNS} className="h-full">
            <NewsCard news={news} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
