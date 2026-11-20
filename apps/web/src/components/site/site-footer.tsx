import { getTranslations } from "next-intl/server";
import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { siInstagram, siYoutube } from "simple-icons";
import { Link } from "@/i18n/navigation";
import { fetchSiteSetting } from "@/lib/public-api";
import { phoneHref } from "@/lib/site-links";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { linkedinIcon, SocialIcon } from "./social-icon";
import { Wordmark } from "./wordmark";

interface ContactItemProps {
  icon: LucideIcon;
  wide?: boolean;
  children: React.ReactNode;
}

function ContactItem({ icon: Icon, wide = false, children }: ContactItemProps) {
  return (
    <li className={cn("flex justify-center", wide && "sm:basis-full")}>
      <span
        className={cn(
          "inline-flex items-start gap-2.5",
          wide && "max-sm:flex-col max-sm:items-center max-sm:gap-1.5",
        )}
      >
        <Icon
          aria-hidden
          className="mt-1 size-4 shrink-0 text-brand-300"
          strokeWidth={1.75}
        />
        {children}
      </span>
    </li>
  );
}

const footerLinkClass =
  "decoration-white/50 underline-offset-4 transition-colors duration-150 hover:text-white hover:underline";

interface SiteFooterProps {
  locale: Locale;
}

export async function SiteFooter({ locale }: SiteFooterProps) {
  const t = await getTranslations("footer");
  const setting = await fetchSiteSetting(locale);

  const socials = [
    { label: "Instagram", url: setting?.instagramUrl, icon: siInstagram },
    { label: "YouTube", url: setting?.youtubeUrl, icon: siYoutube },
    { label: "LinkedIn", url: setting?.linkedinUrl, icon: linkedinIcon },
  ].filter((social) => social.url);

  const hasContact = Boolean(
    setting?.address ||
    setting?.phone ||
    setting?.email ||
    setting?.workingHours,
  );

  return (
    <footer className="mt-20 bg-brand text-night-text md:mt-32 [main:has([data-flush-footer])+&]:mt-0">
      <div className="site-container pt-16 pb-7 md:pt-20">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="w-fit">
            <Wordmark className="text-[44px] text-white md:text-[56px]" />
          </Link>
          <p className="mt-4 font-display text-lg font-semibold text-white md:text-xl">
            {t("tagline")}
          </p>

          {hasContact && (
            <>
              <h2 className="sr-only">{t("contact")}</h2>
              <ul className="mt-10 flex flex-col items-center gap-x-10 gap-y-3 text-sm/6 sm:flex-row sm:flex-wrap sm:justify-center md:mt-12 md:text-[15px]/6">
                {setting?.address && (
                  <ContactItem icon={MapPin} wide>
                    <span className="whitespace-pre-line text-balance">
                      {setting.address}
                    </span>
                  </ContactItem>
                )}
                {setting?.phone && (
                  <ContactItem icon={Phone}>
                    <a
                      href={phoneHref(setting.phone)}
                      className={footerLinkClass}
                    >
                      {setting.phone}
                    </a>
                  </ContactItem>
                )}
                {setting?.email && (
                  <ContactItem icon={Mail}>
                    <a
                      href={`mailto:${setting.email}`}
                      className={footerLinkClass}
                    >
                      {setting.email}
                    </a>
                  </ContactItem>
                )}
                {setting?.workingHours && (
                  <ContactItem icon={Clock}>
                    <span>{setting.workingHours}</span>
                  </ContactItem>
                )}
              </ul>
            </>
          )}

          {socials.length > 0 && (
            <ul aria-label={t("socials")} className="mt-8 flex gap-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="grid size-10 place-items-center rounded-control bg-white/10 text-white transition-colors duration-150 hover:bg-white/20"
                  >
                    <SocialIcon icon={social.icon} className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-14 flex flex-col-reverse items-center gap-3 border-t border-white/20 pt-5 text-[13px] text-white/75 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} Cosmo. {t("rights")}
          </p>
          <LanguageSwitcher tone="dark" className="-mx-1.5" />
        </div>
      </div>
    </footer>
  );
}
