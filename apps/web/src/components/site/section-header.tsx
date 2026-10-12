import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface SectionHeaderProps {
  id: string;
  title: string;
  as?: "h1" | "h2";
  link?: { href: string; label: string };
}

export function SectionHeader({
  id,
  title,
  as: Heading = "h2",
  link,
}: SectionHeaderProps) {
  return (
    <div className="relative flex flex-wrap items-end justify-between gap-4 border-b border-foreground/10 pb-5 md:pb-6">
      <Heading
        id={id}
        className="text-3xl leading-[1.1] font-semibold tracking-tight text-balance md:text-5xl"
      >
        {title}
      </Heading>
      {link && (
        <Link
          href={link.href}
          className="group inline-flex items-center gap-2 text-[15px] font-medium text-primary"
        >
          {link.label}
          <ArrowRight className="size-4 transition-[translate] duration-200 ease-(--ease-out) group-hover:translate-x-0.5" />
        </Link>
      )}
      <span
        aria-hidden
        className="bg-brand-gradient absolute -bottom-px left-0 h-0.5 w-24 rounded-full md:w-32"
      />
    </div>
  );
}
