import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { Link } from "@/i18n/navigation";

export async function AboutIntroSection() {
  const t = await getTranslations();

  return (
    <section
      aria-labelledby="about-intro-title"
      className="site-container grid gap-8 py-20 md:py-32 lg:grid-cols-12 lg:gap-x-6"
    >
      <Reveal className="grid content-start gap-6 lg:col-span-6">
        <p className="eyebrow text-ink-3">{t("nav.about")}</p>
        <h2 id="about-intro-title" className="type-h2 text-balance">
          {t("home.aboutTitle")}
        </h2>
      </Reveal>

      <Reveal
        index={1}
        className="grid content-end justify-items-start gap-8 lg:col-span-5 lg:col-start-8"
      >
        <p className="max-w-150 text-base text-pretty text-ink-2">
          {t("home.aboutText")}
        </p>
        <Link
          href="/about"
          className={siteButtonClass("secondary", "min-w-55")}
        >
          {t("about.historyTitle")}
          <ArrowRight className="size-4.5" />
        </Link>
      </Reveal>
    </section>
  );
}
