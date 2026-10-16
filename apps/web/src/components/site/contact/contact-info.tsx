import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { siteButtonClass } from "@/components/site/site-button";
import type { PublicSiteSetting } from "@/lib/public-api";
import { phoneHref } from "@/lib/site-links";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function InfoRow({ icon, label, children }: InfoRowProps) {
  return (
    <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-4 border-t border-white/28 py-5">
      <span className="flex size-11 items-center justify-center bg-white/10 text-white">
        {icon}
      </span>
      <div className="grid gap-1">
        <dt className="text-[13px] text-night-text">{label}</dt>
        <dd className="text-[17px] leading-snug text-white">{children}</dd>
      </div>
    </div>
  );
}

const linkClass =
  "underline-offset-4 transition-colors duration-150 hover:underline";

interface ContactInfoProps {
  setting: PublicSiteSetting | null;
}

export async function ContactInfo({ setting }: ContactInfoProps) {
  const t = await getTranslations("contact");

  const socials = [
    { label: "Facebook", url: setting?.facebookUrl },
    { label: "Instagram", url: setting?.instagramUrl },
    { label: "YouTube", url: setting?.youtubeUrl },
    { label: "LinkedIn", url: setting?.linkedinUrl },
  ].filter((social) => social.url);

  return (
    <div className="grid content-start gap-8 bg-brand-night px-6 py-8 text-white sm:px-10 sm:py-10">
      <dl className="border-b border-white/28">
        {setting?.address && (
          <InfoRow icon={<MapPin className="size-5" />} label={t("address")}>
            <span className="whitespace-pre-line">{setting.address}</span>
          </InfoRow>
        )}
        {setting?.phone && (
          <InfoRow icon={<Phone className="size-5" />} label={t("phone")}>
            <a href={phoneHref(setting.phone)} className={linkClass}>
              {setting.phone}
            </a>
          </InfoRow>
        )}
        {setting?.email && (
          <InfoRow icon={<Mail className="size-5" />} label={t("email")}>
            <a href={`mailto:${setting.email}`} className={linkClass}>
              {setting.email}
            </a>
          </InfoRow>
        )}
        {setting?.workingHours && (
          <InfoRow icon={<Clock className="size-5" />} label={t("hours")}>
            {setting.workingHours}
          </InfoRow>
        )}
      </dl>

      {socials.length > 0 && (
        <div className="grid gap-3">
          <h2 className="text-[13px] text-night-text">{t("socials")}</h2>
          <div className="flex flex-wrap gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.url ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-1.5 border border-white/40 px-4 text-[15px] font-medium transition-colors duration-150 hover:bg-white/10"
              >
                {social.label}
                <ArrowUpRight className="size-4" />
              </a>
            ))}
          </div>
        </div>
      )}

      {setting?.mapImageUrl && (
        <a
          href={setting.mapUrl ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-16/10 overflow-hidden rounded-card bg-white/10"
        >
          <Image
            src={setting.mapImageUrl}
            alt={t("openMap")}
            fill
            unoptimized
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </a>
      )}

      {setting?.mapUrl && (
        <a
          href={setting.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={siteButtonClass("white", "w-fit min-w-60")}
        >
          {t("openMap")}
          <MapPin className="size-4.5" />
        </a>
      )}
    </div>
  );
}
