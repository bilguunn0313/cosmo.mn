import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { siteButtonClass } from "@/components/site/site-button";

interface BrandsCoverProps {
  title: string;
  countLabel: string;
  catalogLabel: string | null;
  imageUrl: string | null;
}

export function BrandsCover({
  title,
  countLabel,
  catalogLabel,
  imageUrl,
}: BrandsCoverProps) {
  return (
    <section className="site-container pt-6 md:pt-10">
      <div className="relative h-[clamp(360px,62vh,680px)] overflow-hidden bg-brand-night">
        {imageUrl && (
          <div className="cover-zoom absolute inset-x-0 -inset-y-[6%]">
            <div className="cover-drift absolute inset-0">
              <Image
                src={imageUrl}
                alt=""
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-brand-night/75 to-transparent md:h-[45%]"
        />

        <div className="absolute inset-x-4 bottom-6 flex flex-wrap items-end justify-between gap-6 text-white md:inset-x-8 md:bottom-10 xl:inset-x-12 xl:bottom-12">
          <h1 className="animate-in fade-in slide-in-from-bottom-6 text-[clamp(52px,8vw,136px)] leading-[0.88] font-semibold tracking-heading duration-900 ease-(--ease-out) fill-mode-both delay-250">
            {title}
          </h1>
          <div className="animate-in fade-in slide-in-from-bottom-6 flex flex-wrap items-center gap-4 duration-900 ease-(--ease-out) fill-mode-both delay-400">
            <span className="text-[15px] font-semibold">{countLabel}</span>
            {catalogLabel && (
              <a
                href="#catalog"
                className={siteButtonClass("white", "min-w-52.5")}
              >
                {catalogLabel}
                <ArrowDown className="size-4.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
