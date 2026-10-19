import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchSiteSetting } from "@/lib/public-api";
import { phoneHref } from "@/lib/site-links";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { CONTACT_HREF, SITE_NAV } from "./site-nav";
import { Wordmark } from "./wordmark";

interface FooterColumnProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

function FooterColumn({ title, className, children }: FooterColumnProps) {
  return (
    <div className={cn("grid content-start gap-2.5", className)}>
      <h2 className="eyebrow mb-1.5 text-ink-3">{title}</h2>
      <div className="grid gap-2.5 text-[15px]">{children}</div>
    </div>
  );
}

const footerLinkClass =
  "w-fit transition-colors duration-150 hover:text-brand-700";

interface SiteFooterProps {
  locale: Locale;
}

export async function SiteFooter({ locale }: SiteFooterProps) {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const setting = await fetchSiteSetting(locale);

  const socials = [
    { label: "Facebook", url: setting?.facebookUrl },
    { label: "Instagram", url: setting?.instagramUrl },
    { label: "YouTube", url: setting?.youtubeUrl },
    { label: "LinkedIn", url: setting?.linkedinUrl },
  ].filter((social) => social.url);

  return (
    <footer className="mt-20 border-t border-rule md:mt-32">
      <div className="site-container pt-14 pb-7">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6">
          <div className="grid content-start gap-4 sm:col-span-2 lg:col-span-4">
            <Link href="/" className="w-fit">
              <Wordmark />
            </Link>
            <p className="max-w-85 text-[15px] text-ink-2">
              {t("description")}
            </p>
          </div>

          <FooterColumn
            title={t("menu")}
            className="lg:col-span-2 lg:col-start-6"
          >
            {SITE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={footerLinkClass}
              >
                {tNav(item.key)}
              </Link>
            ))}
            <Link href={CONTACT_HREF} className={footerLinkClass}>
              {tNav("contact")}
            </Link>
          </FooterColumn>

          <FooterColumn title={t("contact")} className="lg:col-span-3">
            {setting?.address && (
              <p className="whitespace-pre-line">{setting.address}</p>
            )}
            {setting?.phone && (
              <a href={phoneHref(setting.phone)} className={footerLinkClass}>
                {setting.phone}
              </a>
            )}
            {setting?.email && (
              <a href={`mailto:${setting.email}`} className={footerLinkClass}>
                {setting.email}
              </a>
            )}
            {setting?.workingHours && <p>{setting.workingHours}</p>}
          </FooterColumn>

          {socials.length > 0 && (
            <FooterColumn title={t("socials")} className="lg:col-span-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  {social.label}
                </a>
              ))}
            </FooterColumn>
          )}
        </div>

        <div className="mt-14 flex flex-col-reverse justify-between gap-3 border-t border-rule pt-4 text-[13px] text-ink-3 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Cosmo. {t("rights")}
          </p>
          <LanguageSwitcher className="-mx-1.5" />
        </div>
      </div>
    </footer>
  );
}
