import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ImageReveal } from "@/components/site/image-reveal";
import { Reveal } from "@/components/site/reveal";
import { imageFrameStyle } from "@/lib/image-frame";

function superscript(chunks: React.ReactNode) {
  return <sup>{chunks}</sup>;
}

interface CompanyIntroProps {
  imageUrl: string;
}

export async function CompanyIntro({ imageUrl }: CompanyIntroProps) {
  const t = await getTranslations();

  return (
    <section aria-labelledby="about-title" className="pb-20 md:pb-30">
      <div className="site-container grid gap-8 md:gap-12 xl:grid-cols-[7fr_5fr] xl:gap-x-16 xl:gap-y-10">
        <Reveal className="flex flex-col gap-5.5">
          <h1 id="about-title" className="type-section text-balance text-ink">
            {t.rich("about.intro.title", {
              highlight: (chunks) => (
                <span className="text-brand">{chunks}</span>
              ),
            })}
          </h1>
        </Reveal>

        <div className="relative aspect-4/3 overflow-hidden rounded-card bg-surface md:aspect-16/9 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:aspect-auto">
          <ImageReveal delay={0.15}>
            <Image
              src={imageUrl}
              style={imageFrameStyle(imageUrl)}
              alt={t("about.intro.imageAlt")}
              fill
              unoptimized
              sizes="(min-width: 1280px) 560px, 100vw"
              className="object-cover"
            />
          </ImageReveal>
        </div>

        <Reveal
          index={1}
          className="flex max-w-[70ch] flex-col gap-5 xl:max-w-none"
        >
          <p className="font-display text-xl leading-[1.5] font-medium text-pretty text-ink md:text-[22px]">
            {t("about.intro.lead")}
          </p>
          <p className="text-base leading-[1.75] text-pretty text-ink-2 md:text-[17px]">
            {t.rich("about.intro.body", { sup: superscript })}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
