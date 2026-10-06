import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";

export const metadata: Metadata = { title: "Холбоо барих" };

export default function Page() {
  return (
    <ComingSoon
      title="Холбоо барих"
      description="Хаяг, утас, сошиал холбоос, албад"
      step={8}
    />
  );
}
