import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { FadeInImage } from "@/components/site/fade-in-image";
import { ImageReveal } from "@/components/site/image-reveal";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { Link } from "@/i18n/navigation";

interface AboutIntroSectionProps {
  imageUrl: string;
}

export async function AboutIntroSection({ imageUrl }: AboutIntroSectionProps) {
  const t = await getTranslations();

  return (
    <section
      aria-labelledby="about-intro-title"
      className="site-container grid gap-10 py-20 md:py-32 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-x-[8.33%]"
    >
      <Reveal className="grid justify-items-start gap-5">
        <p className="eyebrow text-ink-3">{t("nav.about")}</p>
        <h2 id="about-intro-title" className="type-h2 text-balance">
          {t("home.aboutTitle")}
        </h2>
        <p className="max-w-[58ch] text-base leading-relaxed text-pretty text-ink-2 md:text-[17px]">
          {t("home.aboutText")}
        </p>
        <Link
          href="/about"
          className={siteButtonClass("secondary", "group mt-3 min-w-55")}
        >
          {t("about.historyTitle")}
          <ArrowRight className="size-4.5 transition-[translate] duration-200 ease-out group-hover:translate-x-0.5" />
        </Link>
      </Reveal>

      <div className="relative aspect-4/3 overflow-hidden rounded-card bg-surface lg:order-first lg:aspect-5/4">
        <ImageReveal>
          <FadeInImage
            src={imageUrl}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </ImageReveal>
      </div>
    </section>
  );
}
