import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { SlidesPanel } from "@/components/admin/home/slides-panel";
import { PageHeader } from "@/components/admin/page-header";
import { SectionsPanel } from "@/components/admin/sections/sections-panel";

export const metadata: Metadata = { title: "Нүүр хуудас" };

const AUTOMATIC_SECTIONS = [
  "Брэндүүд: нийтлэгдсэн брэндүүдийн эхний 8 лого",
  "Мэдээ: сүүлд нийтлэгдсэн 3 мэдээ",
  "Холбоо барих: «Холбоо барих» хэсгийн утас, имэйл",
];

export default function HomePageAdmin() {
  return (
    <div className="grid gap-12">
      <PageHeader
        title="Нүүр хуудас"
        description="Сайтын нүүр хуудас дээрээс доош энэ дарааллаар харагдана."
      />

      <SlidesPanel />

      <SectionsPanel
        page="home"
        step={2}
        title="Тойм хэсгүүд"
        description="Гүйлгэхэд гарч ирэх товч хэсгүүд. Жишээ нь «Бидний тухай», «Хүний нөөц». Бүтэн хуудас руу нь хөтлөх «Цааш үзэх» хаягийг заана уу."
        emptyText="Одоогоор тойм хэсэг алга. «Хэсэг нэмэх» дээр дарж «Бидний тухай» хэсгээс эхэлнэ үү."
        showLink
      />

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
