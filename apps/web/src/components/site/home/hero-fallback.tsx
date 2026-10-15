import { getTranslations } from "next-intl/server";
import { HERO_MEDIA_ID } from "@/components/site/site-nav";

export async function HeroFallback() {
  const t = await getTranslations();

  return (
    <section
      id={HERO_MEDIA_ID}
      className="-mt-16 flex h-[80svh] min-h-105 items-end bg-brand text-white lg:-mt-21 lg:h-svh"
    >
      <div className="site-container pb-10 md:pb-16">
        <h2 className="max-w-4xl text-[clamp(44px,6vw,96px)] leading-[0.95] font-semibold tracking-[-0.04em] text-balance">
          {t("home.heroTitle")}
        </h2>
      </div>
    </section>
  );
}
