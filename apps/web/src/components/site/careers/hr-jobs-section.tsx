import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { SmartLink } from "@/components/site/smart-link";
import { imageFrameStyle } from "@/lib/image-frame";
import { cn } from "@/lib/utils";

interface HrJobsSectionProps {
  title: string;
  text: string;
  href: string;
  buttonLabel: string;
  imageUrl: string;
  imageAlt: string;
  className?: string;
  children?: React.ReactNode;
}

export function HrJobsSection({
  title,
  text,
  href,
  buttonLabel,
  imageUrl,
  imageAlt,
  className,
  children,
}: HrJobsSectionProps) {
  return (
    <section
      aria-labelledby="hr-jobs-title"
      data-flush-footer
      className={cn("bg-brand-100 py-20 md:py-26", className)}
    >
      <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <Reveal from="left" className="flex flex-col items-start gap-6">
          <h2 id="hr-jobs-title" className="type-section text-balance text-ink">
            {title}
          </h2>
          <p className="max-w-[56ch] text-[17px] leading-[1.75] text-ink-2">
            {text}
          </p>
          {children}
          <SmartLink
            href={href}
            className={siteButtonClass(
              "primary",
              "mt-2 px-7 text-base font-medium",
            )}
          >
            {buttonLabel}
          </SmartLink>
        </Reveal>

        <Reveal
          from="right"
          delay={0.1}
          className="relative aspect-4/3 overflow-hidden rounded-card bg-surface lg:aspect-9/8"
        >
          <Image
            src={imageUrl}
            style={imageFrameStyle(imageUrl)}
            alt={imageAlt}
            fill
            unoptimized
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
