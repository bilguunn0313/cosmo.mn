import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactDetails } from "@/components/site/contact/contact-details";
import { ContactForm } from "@/components/site/contact/contact-form";
import { Reveal } from "@/components/site/reveal";
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
    <>
      {setting?.mapEmbedUrl && (
        <div className="site-container pt-8 md:pt-14">
          <div className="relative h-60 overflow-hidden rounded-card bg-brand-100 md:h-[clamp(280px,40vh,420px)]">
            <iframe
              src={setting.mapEmbedUrl}
              title={t("contact.mapTitle")}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
          </div>
        </div>
      )}

      <div className="site-container grid gap-14 pt-10 md:pt-14 lg:grid-cols-2 lg:gap-14 xl:grid-cols-[5fr_7fr] xl:gap-20">
        <Reveal>
          <section
            aria-labelledby="contact-title"
            className="flex h-full flex-col gap-4.5"
          >
            <h1
              id="contact-title"
              className="type-h3 font-semibold text-balance text-ink"
            >
              {t("nav.contact")}
            </h1>
            <div className="mt-3 flex w-full flex-1 flex-col">
              <ContactDetails setting={setting} />
            </div>
          </section>
        </Reveal>

        <Reveal index={1}>
          <section aria-labelledby="contact-form-title" className="grid gap-8">
            <h2
              id="contact-form-title"
              className="type-h3 font-semibold text-balance text-ink"
            >
              {t("contact.formTitle")}
            </h2>
            <ContactForm departments={departments} />
          </section>
        </Reveal>
      </div>
    </>
  );
}
