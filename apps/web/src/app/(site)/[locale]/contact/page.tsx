import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/site/contact/contact-form";
import { ContactInfo } from "@/components/site/contact/contact-info";
import { PageBanner } from "@/components/site/page-banner";
import { getPageLocale } from "@/i18n/locale";
import { pageBannerUrl } from "@/lib/page-banners";
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
    <>
      <PageBanner
        title={t("nav.contact")}
        description={t("contact.description")}
        imageUrl={pageBannerUrl(setting, "contact")}
      />

      <div className="site-container grid gap-4 pt-14 md:gap-6 md:pt-20 lg:grid-cols-2">
        <section
          aria-labelledby="contact-form-title"
          className="grid content-start gap-8 rounded-card bg-paper px-5 py-8 sm:p-10"
        >
          <h2 id="contact-form-title" className="type-h3">
            {t("contact.formTitle")}
          </h2>
          <ContactForm departments={departments} />
        </section>

        <ContactInfo setting={setting} />
      </div>
    </>
  );
}
