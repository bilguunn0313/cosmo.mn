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

      <PageBannerPanel
        page="about"
        step={1}
        title="Танилцуулгын зураг"
        description="Хуудасны эхэнд, компанийн танилцуулгын хажууд гарах зураг. Компьютер дээр баруун хагаст босоо, утсан дээр дээд талд хэвтээ тайрагдана, тиймээс гол зүйл нь зургийн голд байвал сайн. 2000×1500 орчим зураг тохиромжтой."
      />

      <PageBannerPanel
        page="ceo"
        step={2}
        title="Гүйцэтгэх захирлын зураг"
        description="«Гүйцэтгэх захирлын мэндчилгээ» хэсгийн хөрөг зураг. Босоо 4:5 харьцаагаар тайрагдана, тиймээс нүүр нь зургийн дээд хагаст, голд байвал сайн. 1200×1500 орчим зураг тохиромжтой."
        emptyHint="Зураг оруулаагүй үед Cosmo-гийн навчин тэмдэгтэй хөх дэвсгэр харагдана."
      />

      <MilestonesPanel step={3} />
    </div>
  );
}
