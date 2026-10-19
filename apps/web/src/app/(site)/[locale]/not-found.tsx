import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteButtonClass } from "@/components/site/site-button";
import { CONTACT_HREF } from "@/components/site/site-nav";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <section className="site-container grid gap-10 pt-16 pb-8 md:pt-24 lg:grid-cols-12 lg:items-end lg:gap-x-6">
      <p
        aria-hidden
        className="text-[clamp(120px,22vw,320px)] leading-[0.8] font-semibold tracking-[-0.06em] text-brand tabular-nums lg:col-span-7"
      >
        404
      </p>
      <div className="grid justify-items-start gap-6 lg:col-span-5">
        <h1 className="type-h2 text-balance">{t("notFound.title")}</h1>
        <p className="max-w-110 text-lg leading-normal text-pretty text-ink-2">
          {t("notFound.text")}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className={siteButtonClass("primary", "min-w-60")}>
            {t("notFound.backHome")}
            <ArrowRight className="size-4.5" />
          </Link>
          <Link href={CONTACT_HREF} className={siteButtonClass("secondary")}>
            {t("nav.contact")}
          </Link>
        </div>
      </div>
    </section>
  );
}
