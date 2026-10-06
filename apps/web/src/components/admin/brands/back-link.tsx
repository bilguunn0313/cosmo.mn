import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function BackToBrands() {
  return (
    <Link
      href="/admin/brands"
      className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
    >
      <ChevronLeft className="size-4" />
      Брэндүүд
    </Link>
  );
}
