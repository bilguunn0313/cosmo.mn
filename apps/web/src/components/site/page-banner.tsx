import Image from "next/image";

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
    <section className="site-container pt-6 md:pt-10">
      <div className="relative h-[clamp(420px,66vh,720px)] overflow-hidden bg-brand-night">
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
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-4/5 bg-linear-to-t from-brand-night/85 via-brand-night/45 to-transparent md:h-3/5"
        />

        <div className="absolute inset-x-4 bottom-6 grid gap-6 text-white md:inset-x-8 md:bottom-10 lg:grid-cols-12 lg:items-end lg:gap-x-6 xl:inset-x-12 xl:bottom-12">
          <h1 className="animate-in fade-in slide-in-from-bottom-6 text-[clamp(52px,8vw,136px)] leading-[0.88] font-semibold tracking-heading text-balance duration-900 ease-(--ease-out) fill-mode-both delay-250 lg:col-span-8">
            {title}
          </h1>
          {(description || children) && (
            <div className="animate-in fade-in slide-in-from-bottom-6 grid justify-items-start gap-5 duration-900 ease-(--ease-out) fill-mode-both delay-400 lg:col-span-4">
              {description && (
                <p className="max-w-120 text-lg leading-normal text-pretty md:text-[19px]">
                  {description}
                </p>
              )}
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
