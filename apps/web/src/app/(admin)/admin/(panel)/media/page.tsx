import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/coming-soon";

export const metadata: Metadata = { title: "Зургийн сан" };

export default function Page() {
  return (
    <ComingSoon
      title="Зургийн сан"
      description="Сайтад ашиглах бүх зураг, видео"
      step={3}
    />
  );
}
