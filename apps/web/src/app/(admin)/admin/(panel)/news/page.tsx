import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";

export const metadata: Metadata = { title: "Медиа" };

export default function Page() {
  return (
    <ComingSoon title="Медиа" description="Мэдээ, кампанит ажил" step={7} />
  );
}
