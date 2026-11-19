import { getTranslations } from "next-intl/server";
import { siFacebook, siInstagram, siYoutube } from "simple-icons";
import { Link } from "@/i18n/navigation";
import { fetchSiteSetting } from "@/lib/public-api";
import { phoneHref } from "@/lib/site-links";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { linkedinIcon, SocialIcon } from "./social-icon";
import { Wordmark } from "./wordmark";

interface FooterColumnProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

function FooterColumn({ title, className, children }: FooterColumnProps) {
  return (
    <div className={cn("grid content-start gap-4", className)}>
      <h2 className="eyebrow text-brand-300">{title}</h2>
      <div className="grid gap-2 text-sm/6">{children}</div>
    </div>
  );
}

const footerLinkClass =
  "w-fit decoration-white/50 underline-offset-4 transition-colors duration-150 hover:text-white hover:underline";

interface SiteFooterProps {
  locale: Locale;
}

export async function SiteFooter({ locale }: SiteFooterProps) {
  const t = await getTranslations("footer");
  const setting = await fetchSiteSetting(locale);

  const socials = [
    { label: "Facebook", url: setting?.facebookUrl, icon: siFacebook },
    { label: "Instagram", url: setting?.instagramUrl, icon: siInstagram },
    { label: "YouTube", url: setting?.youtubeUrl, icon: siYoutube },
    { label: "LinkedIn", url: setting?.linkedinUrl, icon: linkedinIcon },
  ].filter((social) => social.url);

  return (
    <footer className="mt-20 bg-brand text-night-text md:mt-32 [main:has([data-flush-footer])+&]:mt-0">
      <div className="site-container pt-16 pb-7 md:pt-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6">
          <div className="grid content-start gap-3 sm:col-span-2 lg:col-span-5">
            <Link href="/" className="w-fit">
              <Wordmark className="text-white" />
            </Link>
            <p className="font-display text-lg font-semibold text-white">
              {t("tagline")}
            </p>
          </div>

          <FooterColumn
            title={t("contact")}
            className="lg:col-span-4 lg:col-start-7"
          >
            {setting?.address && (
              <p className="max-w-[46ch] whitespace-pre-line text-balance">
                {setting.address}
              </p>
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
              <div className="flex flex-wrap gap-2">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="grid size-10 place-items-center rounded-control bg-white/10 text-white transition-colors duration-150 hover:bg-white/20"
                  >
                    <SocialIcon icon={social.icon} className="size-5" />
                  </a>
                ))}
              </div>
            </FooterColumn>
          )}
        </div>

        <div className="mt-14 flex flex-col-reverse justify-between gap-3 border-t border-white/20 pt-5 text-[13px] text-white/75 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Cosmo. {t("rights")}
          </p>
          <LanguageSwitcher tone="dark" className="-mx-1.5" />
        </div>
      </div>
    </footer>
  );
}
