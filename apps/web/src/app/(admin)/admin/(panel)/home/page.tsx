import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { CategoryImagesPanel } from "@/components/admin/home/category-images-panel";
import { SlidesPanel } from "@/components/admin/home/slides-panel";
import { StatsPanel } from "@/components/admin/home/stats-panel";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = { title: "Нүүр хуудас" };

const AUTOMATIC_SECTIONS = [
  "Брэндийн тууз: нийтлэгдсэн брэндүүдийн лого",
  "Дэлхийн газрын зураг: брэндүүдийн «Гарал үүслийн улс»",
  "Мэдээ: сүүлд нийтлэгдсэн мэдээнүүд",
];

export default function HomePageAdmin() {
  return (
    <div className="grid gap-12">
      <PageHeader
        title="Нүүр хуудас"
        description="Сайтын нүүр хуудас дээрээс доош энэ дарааллаар харагдана."
      />

      <SlidesPanel />

      <StatsPanel step={2} />

      <CategoryImagesPanel step={3} />

      <aside className="flex gap-3 rounded-xl bg-muted/50 p-4 text-sm">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="grid gap-1.5">
          <p className="font-medium">Автоматаар гарах хэсгүүд</p>
          <p className="text-muted-foreground">
            Эдгээрийг энд засах шаардлагагүй. Тухайн хэсэгт мэдээлэл нэмэхэд
            нүүр хуудсанд шууд гарна.
          </p>
          <ul className="list-disc pl-5 text-muted-foreground">
            {AUTOMATIC_SECTIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
