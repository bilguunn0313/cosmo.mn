import type { Metadata } from "next";
import { RetailPartnersPanel } from "@/components/admin/home/retail-partners-panel";
import { SlidesPanel } from "@/components/admin/home/slides-panel";
import { StatsPanel } from "@/components/admin/home/stats-panel";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = { title: "Нүүр хуудас" };

export default function HomePageAdmin() {
  return (
    <div className="grid gap-12">
      <PageHeader
        title="Нүүр хуудас"
        description="Сайтын нүүр хуудас дээрээс доош энэ дарааллаар харагдана."
      />

      <SlidesPanel />

      <StatsPanel step={2} />

      <RetailPartnersPanel step={3} />
    </div>
  );
}
