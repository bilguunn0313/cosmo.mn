import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { ABOUT_CONTENT, CEO_PHOTO_PLACEHOLDER } from "@/lib/about";

export async function CeoMessage() {
  const t = await getTranslations("about.ceo");
  const photoUrl = ABOUT_CONTENT.ceoPhotoUrl;

  return (
    <section
      aria-labelledby="ceo-title"
      className="site-container grid gap-8 pt-20 md:pt-32 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-x-16 xl:gap-x-24"
    >
      <Reveal className="relative aspect-4/5 w-full max-w-120 overflow-hidden rounded-card bg-brand-100 lg:h-[min(calc(100svh-10rem),600px)] lg:w-auto lg:max-w-none">
        <Image
          src={photoUrl ?? CEO_PHOTO_PLACEHOLDER}
          alt={photoUrl ? t("name") : ""}
          fill
          unoptimized
          sizes="(min-width: 1024px) 480px, 100vw"
          className="object-cover"
        />
      </Reveal>

      <Reveal delay={0.1} className="flex flex-col gap-6">
        <h2 id="ceo-title" className="eyebrow text-brand-700">
          {t("title")}
        </h2>
        <blockquote className="max-w-180 type-h3 text-balance">
          <span aria-hidden className="text-brand">
            “
          </span>
          {t("quote")}
          <span aria-hidden className="text-brand">
            ”
          </span>
        </blockquote>
        <p className="max-w-180 text-base leading-relaxed text-pretty text-ink-2">
          {t("body")}
        </p>
        <p className="grid gap-1 border-l-2 border-brand pl-4">
          <span className="text-lg font-semibold">{t("name")}</span>
          <span className="text-sm text-ink-3">{t("role")}</span>
        </p>
      </Reveal>
    </section>
  );
}
