import Image from "next/image";

interface PageBannerProps {
  title: string;
  imageUrl: string | null;
}

/** Full-width photo banner with the page title bottom-left. Shared by About, HR and Media. */
export function PageBanner({ title, imageUrl }: PageBannerProps) {
  return (
    <section className="relative h-[clamp(360px,58vh,640px)] overflow-hidden bg-surface">
      {imageUrl && (
        <div className="hero-zoom absolute inset-0">
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
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-linear-to-t from-brand-night/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[1440px] px-4 pb-8 md:px-6 md:pb-12 xl:px-12 xl:pb-16">
          <h1
            className={
              "animate-in fade-in slide-in-from-bottom-6 text-[clamp(36px,4vw,60px)] leading-none font-semibold tracking-heading duration-1000 ease-(--ease-out) fill-mode-both delay-350 " +
              (imageUrl ? "text-white" : "text-foreground")
            }
          >
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
