import type { Metadata } from "next";
import { BrandsList } from "@/components/admin/brands/brands-list";

export const metadata: Metadata = { title: "Брэндүүд" };

export default function BrandsPage() {
  return <BrandsList />;
}
