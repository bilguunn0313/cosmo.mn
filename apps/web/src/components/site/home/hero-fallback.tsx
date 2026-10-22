import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { HERO_HEIGHT_CLASS } from "./hero-size";

export async function HeroFallback() {
  const t = await getTranslations();

  return (
    <section
      className={cn("flex items-end bg-brand text-white", HERO_HEIGHT_CLASS)}
    >
      <div className="site-container pb-10 md:pb-16">
        <h2 className="max-w-4xl type-display text-balance">
          {t("home.heroTitle")}
        </h2>
      </div>
    </section>
  );
}
