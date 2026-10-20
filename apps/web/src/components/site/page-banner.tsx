import Image from "next/image";
import { PAGE_BANNER_ID } from "./site-nav";

interface BannerImageProps {
  imageUrl: string;
  children?: React.ReactNode;
}

export function BannerImage({ imageUrl, children }: BannerImageProps) {
  return (
    <div
      id={PAGE_BANNER_ID}
      className="relative h-[clamp(320px,52vh,520px)] overflow-hidden bg-brand-night"
    >
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
      {children}
    </div>
  );
}

interface PageBannerProps {
  title: string;
  description?: string;
  imageUrl: string;
  children?: React.ReactNode;
}

export function PageBanner({
  title,
  description,
  imageUrl,
  children,
}: PageBannerProps) {
  return (
    <section>
      <BannerImage imageUrl={imageUrl}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-4/5 bg-linear-to-t from-brand-night/85 via-brand-night/45 to-transparent md:h-3/5"
        />

        <div className="site-container absolute inset-x-0 bottom-10 grid justify-items-start gap-4 text-white md:bottom-14">
          <h1 className="animate-in fade-in slide-in-from-bottom-6 max-w-3xl type-display text-balance duration-900 ease-(--ease-out) fill-mode-both delay-250">
            {title}
          </h1>
          {(description || children) && (
            <div className="animate-in fade-in slide-in-from-bottom-6 grid justify-items-start gap-5 duration-900 ease-(--ease-out) fill-mode-both delay-400">
              {description && (
                <p className="max-w-150 text-base leading-relaxed text-pretty">
                  {description}
                </p>
              )}
              {children}
            </div>
          )}
        </div>
      </BannerImage>
    </section>
  );
}
