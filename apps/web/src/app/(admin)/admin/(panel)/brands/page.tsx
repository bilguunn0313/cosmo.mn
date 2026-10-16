import type { Metadata } from "next";
import { BrandsList } from "@/components/admin/brands/brands-list";
import { PageBannerPanel } from "@/components/admin/page-banner-panel";

export const metadata: Metadata = { title: "Брэндүүд" };

export default function BrandsPage() {
  return (
    <div className="grid gap-12">
      <BrandsList />
      <PageBannerPanel page="brands" />
    </div>
  );
}
