import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { Link } from "@/i18n/navigation";
import type { CompanyValue } from "@/lib/about";

interface ValuesListProps {
  title: string;
  careersLabel: string;
  values: CompanyValue[];
}

export function ValuesList({ title, careersLabel, values }: ValuesListProps) {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pt-24 md:px-6 md:pt-32 xl:px-12 xl:pt-40">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-foreground pb-6 md:pb-10">
        <h2 className="m-0 text-[clamp(40px,4.8vw,72px)] leading-[0.95] font-bold tracking-[-0.045em]">
          {title}
        </h2>
        <Link
          href="/human-resources"
          className="inline-flex items-center gap-2.5 py-2 text-[15px] font-semibold text-brand-700 no-underline hover:text-brand"
        >
          {careersLabel}
          <ArrowRight className="size-[18px]" />
        </Link>
      </div>

      <ul className="m-0 list-none p-0">
        {values.map((v) => (
          <li
            key={v.title}
            className="flex flex-col gap-5 border-b-2 border-rule py-8 sm:flex-row sm:items-center sm:gap-12 md:py-14 lg:gap-24"
          >
            <Reveal className="relative aspect-square w-28 shrink-0 overflow-hidden bg-surface sm:w-[clamp(120px,14vw,200px)]">
              {v.imageUrl && (
                <Image
                  src={v.imageUrl}
                  alt={v.title}
                  fill
                  unoptimized
                  sizes="200px"
                  className="object-cover"
                />
              )}
            </Reveal>
            <Reveal delay={0.08} className="min-w-0 flex-1">
              <p className="m-0 text-[clamp(24px,2.6vw,40px)] leading-tight font-medium tracking-[-0.025em] text-pretty">
                <strong className="font-bold text-brand">{v.title}.</strong>{" "}
                <span className="text-foreground">{v.description}</span>
              </p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
