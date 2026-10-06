import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";

export const metadata: Metadata = { title: "Админууд" };

export default function Page() {
  return (
    <ComingSoon
      title="Админууд"
      description="Админ панел ашиглах хүмүүс, нууц үг солих"
      step={9}
    />
  );
}
