import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteButtonClass } from "./site-button";

interface SectionHeaderProps {
  id: string;
  title: string;
  as?: "h1" | "h2";
  eyebrow?: string;
  link?: { href: string; label: string };
}

export function SectionHeader({
  id,
  title,
  as: Heading = "h2",
  eyebrow,
  link,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-rule pb-5 md:pb-6">
      <div className="grid gap-4 md:gap-5">
        {eyebrow && <p className="eyebrow text-ink-3">{eyebrow}</p>}
        <Heading
          id={id}
          className="text-[clamp(40px,4.8vw,72px)] leading-[0.98] font-semibold tracking-heading text-balance"
        >
          {title}
        </Heading>
      </div>
      {link && (
        <Link href={link.href} className={siteButtonClass("ghost", "group")}>
          {link.label}
          <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
