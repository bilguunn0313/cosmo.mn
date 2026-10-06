import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";

export const metadata: Metadata = { title: "Нүүр хуудас" };

export default function Page() {
  return (
    <ComingSoon
      title="Нүүр хуудас"
      description="Carousel болон нүүр хуудасны тойм хэсгүүд"
      step={4}
    />
  );
}
