import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/site/reveal";
import { siteButtonClass } from "@/components/site/site-button";
import { CONTACT_HREF } from "@/components/site/site-nav";
import { Link } from "@/i18n/navigation";

export async function PartnerBand() {
  const t = await getTranslations();

  return (
    <section aria-labelledby="partner-title" className="bg-brand text-white">
      <div className="site-container flex flex-col items-start gap-7 pt-20 pb-18 md:pt-28 md:pb-24">
        <p className="eyebrow">{t("home.partnerEyebrow")}</p>
        <Reveal>
          <h2
            id="partner-title"
            className="text-[clamp(56px,9vw,136px)] leading-[0.92] font-semibold tracking-[-0.05em] text-balance"
          >
            {t("about.partnerTitle")}
          </h2>
        </Reveal>
        <p className="max-w-160 text-lg text-pretty md:text-[21px] md:leading-normal">
          {t("about.partnerText")}
        </p>
        <Link
          href={CONTACT_HREF}
          className={siteButtonClass("white", "h-14 min-w-65 text-base")}
        >
          {t("nav.contact")}
          <ArrowUpRight className="size-4.5" />
        </Link>
      </div>
    </section>
  );
}
