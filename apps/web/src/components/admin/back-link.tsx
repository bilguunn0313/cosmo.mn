import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface BackLinkProps {
  href: string;
  label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
    >
      <ChevronLeft className="size-4" />
      {label}
    </Link>
  );
}
