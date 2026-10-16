import type { Metadata } from "next";
import { MilestonesPanel } from "@/components/admin/about/milestones-panel";
import { PageBannerPanel } from "@/components/admin/page-banner-panel";
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

      <PageBannerPanel page="about" step={1} />

      <SectionsPanel
        source={{ page: "about" }}
        step={2}
        title="Хэсгүүд"
        description="Хэсэг бүр гарчиг, текст, зурагтай. Жишээ нь «Компанийн танилцуулга», «Эрхэм зорилго», «Үнэт зүйлс»."
        emptyText="Одоогоор хэсэг алга. «Хэсэг нэмэх» дээр дарж «Компанийн танилцуулга» хэсгээс эхэлнэ үү."
        bodyMode="rich"
      />

      <MilestonesPanel step={3} />
    </div>
  );
}
