import type { Metadata } from "next";
import { Noto_Sans_SC, Onest } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import "../../globals.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getPageLocale } from "@/i18n/locale";
import { routing } from "@/i18n/routing";
import { SITE_URL, siteNameFor } from "@/lib/seo";

const onest = Onest({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-sans",
});

const notoSansSc = Noto_Sans_SC({
  variable: "--font-cjk",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale });

  const siteName = siteNameFor(locale);

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: siteName,
    title: { default: t("seo.homeTitle"), template: `%s | ${siteName}` },
    description: t("seo.homeDescription"),
  };
}

export default async function SiteLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const locale = await getPageLocale(params);
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <html
      lang={locale}
      className={`${onest.variable} ${notoSansSc.variable} h-full antialiased`}
    >
      <body className="site flex min-h-full flex-col bg-paper text-ink">
        <a
          href="#main"
          className="sr-only z-50 bg-brand px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
