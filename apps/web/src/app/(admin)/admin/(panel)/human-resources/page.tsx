import type { Metadata } from "next";
import { JobsPanel } from "@/components/admin/jobs/jobs-panel";
import { PageBannerPanel } from "@/components/admin/page-banner-panel";
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

      <PageBannerPanel
        page="careers"
        step={1}
        title="Хүний нөөцийн бодлогын зураг"
        description="Хуудасны эхэнд, «Хүний нөөцийн бодлого» текстийн баруун талд гарах зураг. Хэвтээ, 1600×1200 орчим зураг тохиромжтой."
      />

      <PageBannerPanel
        page="hrGovernance"
        step={2}
        title="Ажиллах орчны зураг"
        description="«Байгууллагын соёл» хэсгийн зүүн талд гарах зураг. Хэвтээ, 1600×1200 орчим зураг тохиромжтой."
      />

      <SectionsPanel
        source={{ page: "human-resources" }}
        step={3}
        title="Хэсгүүд"
        description="«Байгууллагын соёл» хэсгийн доор харагдана. Жишээ нь «Байгууллагын соёл», «Сургалт, хөгжил»."
        emptyText="Одоогоор нэмэлт хэсэг алга."
        bodyMode="rich"
      />

      <JobsPanel step={4} />
    </div>
  );
}
