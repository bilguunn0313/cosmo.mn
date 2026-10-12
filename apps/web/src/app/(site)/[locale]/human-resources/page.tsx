import { ArrowUpRight, Mail } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/site/section-header";
import { StorySections } from "@/components/site/story-sections";
import { getPageLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { fetchSections, fetchSiteSetting } from "@/lib/public-api";

const buttonClass =
  "inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium transition-[background-color,scale] duration-150 ease-(--ease-out) motion-safe:active:scale-[0.97]";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/human-resources">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale });

  return {
    title: t("nav.careers"),
    description: t("careers.description"),
  };
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

      {sections.length > 0 && <StorySections sections={sections} />}

      <section
        aria-labelledby="join-title"
        className="relative grid gap-6 overflow-hidden rounded-3xl bg-card p-6 sm:p-10 md:rounded-[2rem] lg:grid-cols-[1fr_auto] lg:items-center lg:p-14"
      >
        <span
          aria-hidden
          className="bg-brand-gradient absolute inset-x-0 top-0 h-1"
        />
        <div className="grid max-w-2xl gap-3">
          <h2
            id="join-title"
            className="text-2xl leading-[1.15] font-semibold tracking-tight md:text-4xl"
          >
            {t("careers.joinTitle")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("careers.joinText")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {setting?.email && (
            <a
              href={`mailto:${setting.email}`}
              className={`${buttonClass} bg-primary text-primary-foreground hover:bg-primary/90`}
            >
              <Mail className="size-4" />
              {t("careers.sendCv")}
            </a>
          )}
          <Link
            href="/contact"
            className={`${buttonClass} bg-canvas text-foreground hover:bg-muted`}
          >
            {t("nav.contact")}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
