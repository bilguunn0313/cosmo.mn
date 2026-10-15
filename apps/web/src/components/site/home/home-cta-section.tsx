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
    <section className="mt-20 border-y-2 border-rule md:mt-32 md:bg-linear-to-r md:from-transparent md:from-50% md:to-brand md:to-50%">
      <div className="site-container grid md:grid-cols-2">
        <div className="flex flex-col items-start gap-5 py-14 md:py-18 md:pr-12">
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

        <div className="-mx-4 flex flex-col items-start gap-5 bg-brand px-4 py-14 text-white md:mx-0 md:py-18 md:pr-0 md:pl-12">
          <p className="eyebrow">{t("home.partnerEyebrow")}</p>
          <h2 className="text-[clamp(34px,3.4vw,48px)] leading-[1.04] font-semibold tracking-heading text-balance">
            {t("about.partnerTitle")}
          </h2>
          <p className="max-w-135 text-lg text-pretty">
            {t("about.partnerText")}
          </p>
          <Link
            href="/contact"
            className={siteButtonClass("white", "mt-3 min-w-55")}
          >
            {t("home.contactUs")}
            <ArrowRight className="size-4.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
