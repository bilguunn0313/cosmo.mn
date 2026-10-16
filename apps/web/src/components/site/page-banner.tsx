import Image from "next/image";

interface PageBannerProps {
  title: string;
  imageUrl: string | null;
}

export function PageBanner({ title, imageUrl }: PageBannerProps) {
  return (
    <section className="relative h-[clamp(320px,58vh,640px)] overflow-hidden bg-brand-night">
      {imageUrl && (
        <>
          <div className="cover-zoom absolute inset-0">
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
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-linear-to-t from-brand-night/70 to-transparent"
          />
        </>
      )}
      <div className="absolute inset-x-0 bottom-0">
        <div className="site-container pb-8 md:pb-12 xl:pb-16">
          <h1 className="animate-in fade-in slide-in-from-bottom-6 text-[clamp(44px,6vw,96px)] leading-[0.95] font-semibold tracking-heading text-white duration-1000 ease-(--ease-out) fill-mode-both delay-300">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
