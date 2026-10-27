import { getTranslations } from "next-intl/server";
import { siFacebook, siInstagram, siYoutube } from "simple-icons";
import { Link } from "@/i18n/navigation";
import { fetchSiteSetting } from "@/lib/public-api";
import { phoneHref } from "@/lib/site-links";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { SITE_NAV } from "./site-nav";
import { SocialIcon } from "./social-icon";
import { Wordmark } from "./wordmark";

interface FooterColumnProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

function FooterColumn({ title, className, children }: FooterColumnProps) {
  return (
    <div className={cn("grid content-start gap-2.5", className)}>
      <h2 className="eyebrow mb-1.5 text-brand-300">{title}</h2>
      <div className="grid gap-2.5 text-sm">{children}</div>
    </div>
  );
}

const footerLinkClass = "w-fit transition-colors duration-150 hover:text-white";

interface SiteFooterProps {
  locale: Locale;
}

export async function SiteFooter({ locale }: SiteFooterProps) {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const setting = await fetchSiteSetting(locale);

  const socials = [
    { label: "Facebook", url: setting?.facebookUrl, icon: siFacebook },
    { label: "Instagram", url: setting?.instagramUrl, icon: siInstagram },
    { label: "YouTube", url: setting?.youtubeUrl, icon: siYoutube },
    { label: "LinkedIn", url: setting?.linkedinUrl, icon: null },
  ].filter((social) => social.url);

  return (
    <footer className="mt-20 bg-brand text-night-text md:mt-32">
      <div className="site-container pt-16 pb-7 md:pt-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6">
          <div className="grid content-start gap-4 sm:col-span-2 lg:col-span-4">
            <Link href="/" className="w-fit">
              <Wordmark className="text-white" />
            </Link>
            <p className="max-w-85 text-sm">{t("description")}</p>
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
              <div className="flex flex-wrap items-center gap-2">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className={
                      social.icon
                        ? "flex size-10 items-center justify-center rounded-control bg-white/10 text-white transition-colors duration-150 hover:bg-white/20"
                        : footerLinkClass
                    }
                  >
                    {social.icon ? (
                      <SocialIcon icon={social.icon} className="size-5" />
                    ) : (
                      social.label
                    )}
                  </a>
                ))}
              </div>
            </FooterColumn>
          )}
        </div>

        <div className="mt-14 flex flex-col-reverse justify-between gap-3 border-t border-white/20 pt-4 text-[13px] text-white/75 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Cosmo. {t("rights")}
          </p>
          <LanguageSwitcher tone="dark" className="-mx-1.5" />
        </div>
      </div>
    </footer>
  );
}
