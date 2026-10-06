import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";

export const metadata: Metadata = { title: "Бидний тухай" };

export default function Page() {
  return (
    <ComingSoon
      title="Бидний тухай"
      description="Бидний тухай хуудасны хэсгүүд"
      step={5}
    />
  );
}
