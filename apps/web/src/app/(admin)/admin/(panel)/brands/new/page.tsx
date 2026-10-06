import type { Metadata } from "next";
import { NewBrand } from "@/components/admin/brands/new-brand";

export const metadata: Metadata = { title: "Шинэ брэнд" };

export default function NewBrandPage() {
  return <NewBrand />;
}
