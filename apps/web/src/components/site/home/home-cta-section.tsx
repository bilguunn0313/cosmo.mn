import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteButtonClass } from "@/components/site/site-button";
import { Link } from "@/i18n/navigation";
import type { PublicSiteSetting } from "@/lib/public-api";

interface HomeCtaSectionProps {
  setting: PublicSiteSetting | null;
}

export async function HomeCtaSection({ setting }: HomeCtaSectionProps) {
  const t = await getTranslations();
  const cvButtonClass = siteButtonClass("secondary", "mt-3 min-w-55");

  return (
    <section className="site-container mt-20 md:mt-32">
      <div className="flex flex-col items-start gap-5 md:max-w-[50%]">
        <p className="eyebrow text-ink-3">{t("nav.careers")}</p>
        <h2 className="text-[clamp(34px,3.4vw,48px)] leading-[1.04] font-semibold tracking-heading text-balance">
          {t("careers.joinTitle")}
        </h2>
        <p className="max-w-130 text-lg text-pretty text-ink-2">
          {t("careers.joinText")}
        </p>
        {setting?.email ? (
          <a href={`mailto:${setting.email}`} className={cvButtonClass}>
            {t("careers.sendCv")}
            <ArrowRight className="size-4.5" />
          </a>
        ) : (
          <Link href="/human-resources" className={cvButtonClass}>
            {t("careers.sendCv")}
            <ArrowRight className="size-4.5" />
          </Link>
        )}
      </div>
    </section>
  );
}
