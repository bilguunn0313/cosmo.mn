import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/site/contact/contact-form";
import { ContactInfo } from "@/components/site/contact/contact-info";
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
    <div className="site-container pt-12 md:pt-24">
      <header className="grid gap-5 pb-8 md:pb-10">
        <h1 className="animate-in fade-in slide-in-from-bottom-6 text-[clamp(56px,9vw,144px)] leading-[0.9] font-semibold tracking-heading duration-900 ease-(--ease-out) fill-mode-both">
          {t("nav.contact")}
        </h1>
        <p className="animate-in fade-in slide-in-from-bottom-6 max-w-150 text-lg leading-normal text-pretty text-ink-2 duration-900 ease-(--ease-out) fill-mode-both delay-150 md:text-[19px]">
          {t("contact.description")}
        </p>
      </header>

      <div className="grid gap-12 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-5">
          <ContactInfo setting={setting} />
        </div>

        <section
          aria-labelledby="contact-form-title"
          className="grid content-start gap-8 lg:col-span-6 lg:col-start-7"
        >
          <h2
            id="contact-form-title"
            className="text-[clamp(32px,3.4vw,48px)] leading-none font-semibold tracking-heading"
          >
            {t("contact.formTitle")}
          </h2>
          <ContactForm departments={departments} />
        </section>
      </div>
    </div>
  );
}
