import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandEditor } from "@/components/admin/brands/brand-editor";

export const metadata: Metadata = { title: "Брэнд засах" };

export default async function EditBrandPage({
  params,
}: PageProps<"/admin/brands/[id]">) {
  const { id } = await params;
  const brandId = Number(id);

  if (!Number.isInteger(brandId) || brandId < 1) {
    notFound();
  }

  return <BrandEditor brandId={brandId} />;
}
