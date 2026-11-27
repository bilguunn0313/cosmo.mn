import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SmartLink } from "@/components/site/smart-link";
import { imageFrameStyle } from "@/lib/image-frame";
import { cn } from "@/lib/utils";

const PANEL_TEXT_CLASS =
  "font-display text-lg leading-snug font-medium tracking-[0.08em] text-balance uppercase md:text-2xl";

interface HrJobsSectionProps {
  title: string;
  lead: string;
  count?: number;
  label: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  className?: string;
}

export function HrJobsSection({
  title,
  lead,
  count,
  label,
  href,
  imageUrl,
  imageAlt,
  className,
}: HrJobsSectionProps) {
  const hasCount = count !== undefined;

  return (
    <section
      aria-labelledby="hr-jobs-title"
      data-flush-footer
      className={cn("bg-brand-100 py-20 md:py-26", className)}
    >
      <div className="site-container">
        <Reveal>
          <SectionEyebrow as="h2" id="hr-jobs-title" size="large">
            {title}
          </SectionEyebrow>
        </Reveal>

        <div className="mt-6 grid overflow-hidden rounded-card md:mt-8 md:grid-cols-2">
          <Reveal from="left">
            <SmartLink
              href={href}
              className="group ceo-card relative isolate flex h-full flex-col items-center justify-center overflow-hidden px-6 py-12 text-center text-white md:min-h-100 lg:min-h-125"
            >
              <LogoMark className="absolute -right-16 -bottom-14 -z-10 w-60 text-white/6 lg:-right-24 lg:-bottom-24 lg:w-100" />
              <span className={PANEL_TEXT_CLASS}>{lead}</span>
              {hasCount && (
                <span className="my-1 font-sans text-[120px] leading-none font-light tracking-[-0.03em] md:my-2 md:text-[160px] lg:text-[200px]">
                  {count}
                </span>
              )}
              <span
                className={cn(
                  hasCount
                    ? PANEL_TEXT_CLASS
                    : "mt-4 max-w-[34ch] text-base leading-relaxed text-night-text md:text-[17px]",
                )}
              >
                {label}
              </span>
              <span
                aria-hidden
                className="mt-8 grid size-12 place-items-center rounded-full bg-white text-brand transition-[translate] duration-200 ease-out group-hover:translate-x-1 md:mt-10 md:size-14"
              >
                <ArrowRight className="size-5" />
              </span>
            </SmartLink>
          </Reveal>

          <Reveal
            from="right"
            delay={0.1}
            className="relative aspect-4/3 overflow-hidden bg-surface md:aspect-auto"
          >
            <Image
              src={imageUrl}
              style={imageFrameStyle(imageUrl)}
              alt={imageAlt}
              fill
              unoptimized
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
