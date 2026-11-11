import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { PAGE_BANNER_ID } from "@/components/site/site-nav";

interface AboutHeroProps {
  imageUrl: string;
}

export async function AboutHero({ imageUrl }: AboutHeroProps) {
  const t = await getTranslations();

  return (
    <section
      id={PAGE_BANNER_ID}
      aria-labelledby="about-title"
      className="relative isolate h-130 overflow-hidden bg-brand-700 text-white md:h-150"
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
            className="object-cover object-[70%_center]"
          />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-700/94 via-brand-700/45 via-48% to-brand-700/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-50 bg-linear-to-b from-brand-700/72 to-brand-700/0"
      />

      <div className="site-container relative flex h-full flex-col justify-end gap-4.5 pb-14 md:pb-18">
        <h1
          id="about-title"
          className="hero-rise type-hero text-balance [--rise-delay:100ms]"
        >
          {t("nav.about")}
        </h1>
        <p className="hero-rise max-w-140 text-lg/relaxed text-pretty text-white/88 [--rise-delay:240ms] md:text-[19px]">
          {t("about.description")}
        </p>
      </div>
    </section>
  );
}
