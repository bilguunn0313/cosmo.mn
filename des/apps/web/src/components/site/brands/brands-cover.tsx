import { ArrowDown } from "lucide-react";
import Image from "next/image";

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
    <section className="relative h-[clamp(360px,62vh,680px)] overflow-hidden bg-surface">
      {imageUrl && (
        <div className="hero-zoom absolute inset-y-[-6%] inset-x-0">
          <div className="hero-drift absolute inset-0">
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-brand-night/75 to-transparent md:h-[45%]" />

      <div className="absolute inset-x-4 bottom-6 flex flex-wrap items-end justify-between gap-6 text-white md:inset-x-6 md:bottom-10 xl:inset-x-12 xl:bottom-12">
        <h1 className="animate-in fade-in slide-in-from-bottom-6 text-[clamp(52px,8vw,136px)] leading-[0.88] font-semibold tracking-heading duration-900 ease-(--ease-out) fill-mode-both delay-250">
          {title}
        </h1>
        <div className="animate-in fade-in slide-in-from-bottom-6 flex flex-wrap items-center gap-4 duration-900 ease-(--ease-out) fill-mode-both delay-400">
          <span className="text-[15px] font-semibold">{countLabel}</span>
          {catalogLabel && (
            <a
              href="#catalog"
              className="inline-flex h-12 min-w-52 items-center justify-between gap-4 bg-white px-5 text-[15px] font-medium text-brand-700 transition-colors duration-200 hover:bg-brand-100"
            >
              {catalogLabel}
              <ArrowDown className="size-[18px]" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
