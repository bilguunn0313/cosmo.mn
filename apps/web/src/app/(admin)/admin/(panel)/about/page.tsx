import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { SectionsPanel } from "@/components/admin/sections/sections-panel";

export const metadata: Metadata = { title: "Бидний тухай" };

export default function AboutPageAdmin() {
  return (
    <div className="grid gap-12">
      <PageHeader
        title="Бидний тухай"
        description="Сайтын «Бидний тухай» хуудас. Хэсгүүд дээрээс доош энэ дарааллаар харагдана."
      />

      <SectionsPanel
        source={{ page: "about" }}
        title="Хэсгүүд"
        description="Хэсэг бүр гарчиг, текст, зурагтай. Жишээ нь «Компанийн танилцуулга», «Алсын хараа», «Түүх»."
        emptyText="Одоогоор хэсэг алга. «Хэсэг нэмэх» дээр дарж «Компанийн танилцуулга» хэсгээс эхэлнэ үү."
        bodyMode="rich"
      />
    </div>
  );
}
