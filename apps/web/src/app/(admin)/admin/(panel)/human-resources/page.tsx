import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { SectionsPanel } from "@/components/admin/sections/sections-panel";

export const metadata: Metadata = { title: "Хүний нөөц" };

export default function HumanResourcesPageAdmin() {
  return (
    <div className="grid gap-12">
      <PageHeader
        title="Хүний нөөц"
        description="Сайтын «Хүний нөөц» хуудас. Хэсгүүд дээрээс доош энэ дарааллаар харагдана."
      />

      <SectionsPanel
        page="human-resources"
        title="Хэсгүүд"
        description="Жишээ нь «Хүний нөөцийн бодлого», «Байгууллагын соёл», «Сургалт, хөгжил»."
        emptyText="Одоогоор хэсэг алга. «Хэсэг нэмэх» дээр дарж «Хүний нөөцийн бодлого» хэсгээс эхэлнэ үү."
        bodyMode="rich"
      />
    </div>
  );
}
