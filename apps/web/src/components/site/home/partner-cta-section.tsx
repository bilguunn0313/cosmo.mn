import { getTranslations } from "next-intl/server";
import { LogoMark } from "@/components/site/logo-mark";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { siteButtonClass } from "@/components/site/site-button";
import { CONTACT_HREF } from "@/components/site/site-nav";
import { Link } from "@/i18n/navigation";

export async function PartnerCtaSection() {
  const t = await getTranslations();

  return (
    <section
      aria-labelledby="partner-cta-title"
      data-flush-footer
      className="relative isolate overflow-hidden bg-brand-100 py-20 md:py-26"
    >
      <LogoMark className="absolute -bottom-50 -left-40 -z-10 w-155 text-brand/7" />

      <div className="site-container flex max-w-205 flex-col items-center gap-5 text-center">
        <SectionEyebrow>{t("home.partnerEyebrow")}</SectionEyebrow>
        <h2
          id="partner-cta-title"
          className="type-section text-balance text-ink"
        >
          {t("home.cta.title")}
        </h2>
        <p className="text-lg text-pretty text-ink-2">{t("home.cta.text")}</p>
        <Link
          href={CONTACT_HREF}
          className={siteButtonClass(
            "primary",
            "mt-2 px-7 text-base font-medium",
          )}
        >
          {t("nav.contact")}
        </Link>
      </div>
    </section>
  );
}
