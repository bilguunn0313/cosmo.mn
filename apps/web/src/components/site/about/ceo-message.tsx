import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { ABOUT_CONTENT } from "@/lib/about";
import { cn } from "@/lib/utils";

export async function CeoMessage() {
  const t = await getTranslations("about.ceo");
  const photoUrl = ABOUT_CONTENT.ceoPhotoUrl;

  return (
    <section
      aria-labelledby="ceo-title"
      className="site-container grid gap-10 pt-20 md:pt-28 lg:grid-cols-12 lg:items-end lg:gap-x-6 xl:pt-36"
    >
      <Reveal
        className={cn(
          "order-2 flex flex-col gap-8 lg:order-1",
          photoUrl ? "lg:col-span-6" : "lg:col-span-10",
        )}
      >
        <h2 id="ceo-title" className="eyebrow text-brand-700">
          {t("title")}
        </h2>
        <blockquote
          className={cn(
            "leading-[1.12] font-semibold tracking-[-0.03em] text-balance",
            photoUrl
              ? "text-[clamp(28px,3vw,44px)]"
              : "text-[clamp(32px,4vw,60px)]",
          )}
        >
          <span aria-hidden className="text-brand">
            “
          </span>
          {t("quote")}
          <span aria-hidden className="text-brand">
            ”
          </span>
        </blockquote>
        <p className="max-w-150 text-lg leading-relaxed text-pretty text-ink-2">
          {t("body")}
        </p>
        <p className="grid gap-1 border-l-2 border-brand pl-4">
          <span className="text-[21px] font-semibold">{t("name")}</span>
          <span className="text-[15px] text-ink-3">{t("role")}</span>
        </p>
      </Reveal>

      {photoUrl && (
        <Reveal
          delay={0.1}
          className="relative order-1 aspect-4/5 w-full max-w-140 overflow-hidden rounded-card bg-brand-100 lg:order-2 lg:col-span-5 lg:col-start-8"
        >
          <Image
            src={photoUrl}
            alt={t("name")}
            fill
            unoptimized
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </Reveal>
      )}
    </section>
  );
}
