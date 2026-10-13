import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/site/contact/contact-form";
import { ContactInfo } from "@/components/site/contact/contact-info";
import { SectionHeader } from "@/components/site/section-header";
import { getPageLocale } from "@/i18n/locale";
import { fetchDepartments, fetchSiteSetting } from "@/lib/public-api";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale });
  const setting = await fetchSiteSetting(locale);

  const description =
    setting?.address && setting.phone
      ? t("seo.contactDescription", {
          address: setting.address.replace(/\s*\n\s*/g, ", "),
          phone: setting.phone,
        })
      : t("contact.description");

  return pageMetadata({
    locale,
    path: "/contact",
    title: t("nav.contact"),
    description,
  });
}

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const locale = await getPageLocale(params);
  const t = await getTranslations();
  const [setting, departments] = await Promise.all([
    fetchSiteSetting(locale),
    fetchDepartments(locale),
  ]);

  return (
    <div className="site-container-wide grid gap-8 pt-8 md:gap-10 md:pt-14">
      <div className="grid gap-4">
        <SectionHeader as="h1" id="contact-title" title={t("nav.contact")} />
        <p className="max-w-2xl text-lg text-muted-foreground">
          {t("contact.description")}
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-[1fr_1.3fr]">
        <ContactInfo setting={setting} />

        <section
          aria-labelledby="contact-form-title"
          className="grid content-start gap-8 rounded-3xl bg-card p-6 sm:p-10 md:rounded-[2rem] lg:p-12"
        >
          <h2
            id="contact-form-title"
            className="text-2xl font-semibold tracking-tight md:text-3xl"
          >
            {t("contact.formTitle")}
          </h2>
          <ContactForm departments={departments} />
        </section>
      </div>
    </div>
  );
}
