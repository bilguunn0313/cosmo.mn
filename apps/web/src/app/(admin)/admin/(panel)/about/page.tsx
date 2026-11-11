import type { Metadata } from "next";
import { MilestonesPanel } from "@/components/admin/about/milestones-panel";
import { PageBannerPanel } from "@/components/admin/page-banner-panel";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = { title: "Бидний тухай" };

export default function AboutPageAdmin() {
  return (
    <div className="grid gap-12">
      <PageHeader
        title="Бидний тухай"
        description="Сайтын «Бидний тухай» хуудас. Хэсгүүд дээрээс доош энэ дарааллаар харагдана."
      />

      <PageBannerPanel page="about" step={1} />

      <MilestonesPanel step={2} />
    </div>
  );
}
