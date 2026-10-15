import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteButtonClass } from "@/components/site/site-button";
import { CONTACT_HREF } from "@/components/site/site-nav";
import { Link } from "@/i18n/navigation";

interface BrandWholesaleBandProps {
  brandName: string;
}

export async function BrandWholesaleBand({
  brandName,
}: BrandWholesaleBandProps) {
  const t = await getTranslations("brands");

  return (
    <section
      aria-labelledby="wholesale-title"
      className="mt-20 bg-brand text-white md:mt-28"
    >
      <div className="site-container grid gap-8 py-16 md:py-20 lg:grid-cols-12 lg:items-end lg:gap-x-6">
        <div className="grid gap-4 lg:col-span-7">
          <p className="eyebrow">{t("wholesaleEyebrow")}</p>
          <h2
            id="wholesale-title"
            className="text-[clamp(40px,5vw,76px)] leading-[0.98] font-semibold tracking-heading text-balance"
          >
            {t("wholesaleTitle", { name: brandName })}
          </h2>
        </div>
        <div className="grid justify-items-start gap-5 lg:col-span-5 lg:col-start-8">
          <p className="text-[17px] leading-normal text-pretty">
            {t("wholesaleText")}
          </p>
          <Link
            href={CONTACT_HREF}
            className={siteButtonClass("white", "h-14 w-full max-w-80")}
          >
            {t("wholesaleButton")}
            <ArrowUpRight className="size-4.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
