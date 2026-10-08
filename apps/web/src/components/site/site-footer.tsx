import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchSiteSetting } from "@/lib/public-api";
import type { Locale } from "@/lib/types";
import { CONTACT_HREF, SITE_NAV } from "./site-nav";
import { Wordmark } from "./wordmark";

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div className="grid content-start gap-4">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <div className="grid gap-3 text-[15px] text-white/85">{children}</div>
    </div>
  );
}

const footerLinkClass = "w-fit transition-colors duration-150 hover:text-white";

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

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
    <footer className="site-container-wide pt-20 pb-4 md:pb-6">
      <div className="bg-brand-gradient rounded-3xl px-8 pt-14 pb-8 text-white md:rounded-[2rem] md:px-16 md:pt-20 md:pb-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr]">
          <div className="grid content-start gap-4">
            <Link href="/" className="w-fit">
              <Wordmark className="text-3xl text-white" />
            </Link>
            <p className="max-w-sm text-[15px] leading-relaxed text-white/85">
              {t("description")}
            </p>
          </div>

          <FooterColumn title={t("menu")}>
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

          <FooterColumn title={t("contact")}>
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
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-4 border-t border-white/20 pt-8 text-sm text-white/75 sm:flex-row md:mt-16">
          <p>
            © {new Date().getFullYear()} Cosmo. {t("rights")}
          </p>
          {socials.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-white/25 px-3 py-1.5 text-white/85 transition-colors duration-150 hover:border-white/60 hover:text-white"
                >
                  {social.label}
                  <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
