import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";

export const metadata: Metadata = { title: "Брэндүүд" };

export default function Page() {
  return (
    <ComingSoon
      title="Брэндүүд"
      description="Брэнд, тэдгээрийн түүх, бүтээгдэхүүн"
      step={6}
    />
  );
}
