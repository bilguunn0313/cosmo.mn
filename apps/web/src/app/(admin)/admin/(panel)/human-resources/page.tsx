import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";

export const metadata: Metadata = { title: "Хүний нөөц" };

export default function Page() {
  return (
    <ComingSoon
      title="Хүний нөөц"
      description="Хүний нөөц хуудасны хэсгүүд"
      step={5}
    />
  );
}
