import { ArrowUpRight, Mail } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaCard, ctaButtonClass } from "@/components/site/cta-card";
import { SectionHeader } from "@/components/site/section-header";
import { StorySections } from "@/components/site/story-sections";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { fetchSections, fetchSiteSetting } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/human-resources">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale });

  return pageMetadata({
    locale,
    path: "/human-resources",
    title: t("seo.careersTitle"),
    description: t("seo.careersDescription"),
  });
}

export default async function HumanResourcesPage({
  params,
}: PageProps<"/[locale]/human-resources">) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();
  const [sections, setting] = await Promise.all([
    fetchSections("human-resources", locale),
    fetchSiteSetting(locale),
  ]);

  return (
    <div className="site-container-wide grid gap-8 pt-8 md:gap-10 md:pt-14">
      <div className="grid gap-4">
        <SectionHeader as="h1" id="careers-title" title={t("nav.careers")} />
        <p className="max-w-2xl text-lg text-muted-foreground">
          {t("careers.description")}
        </p>
      </div>

      {sections.length > 0 && (
        <div className="border-b-2 border-rule">
          <StorySections sections={sections} />
        </div>
      )}

      <CtaCard
        id="join-title"
        title={t("careers.joinTitle")}
        text={t("careers.joinText")}
      >
        {setting?.email && (
          <a
            href={`mailto:${setting.email}`}
            className={cn(
              ctaButtonClass,
              "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Mail className="size-4" />
            {t("careers.sendCv")}
          </a>
        )}
        <Link
          href="/contact"
          className={cn(
            ctaButtonClass,
            "bg-canvas text-foreground hover:bg-muted",
          )}
        >
          {t("nav.contact")}
          <ArrowUpRight className="size-4" />
        </Link>
      </CtaCard>
    </div>
  );
}
