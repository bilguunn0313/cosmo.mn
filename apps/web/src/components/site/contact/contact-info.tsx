import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { PublicSiteSetting } from "@/lib/public-api";
import { phoneHref } from "@/lib/site-links";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function InfoRow({ icon, label, children }: InfoRowProps) {
  return (
    <div className="flex gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
        {icon}
      </span>
      <div className="grid gap-0.5">
        <dt className="text-sm text-white/65">{label}</dt>
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
    <div className="grid content-start bg-brand-night gap-10 rounded-3xl p-6 text-white sm:p-10 md:rounded-[2rem] lg:p-12">
      <dl className="grid gap-6">
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
          <h2 className="text-sm text-white/65">{t("socials")}</h2>
          <div className="flex flex-wrap gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.url ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-1 rounded-full border border-white/25 px-4 text-[15px] text-white/90 transition-colors duration-150 hover:border-white/60 hover:text-white"
              >
                {social.label}
                <ArrowUpRight className="size-3.5" />
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
          className="group relative block aspect-[16/10] overflow-hidden rounded-2xl bg-white/10 md:rounded-3xl"
        >
          <Image
            src={setting.mapImageUrl}
            alt={t("openMap")}
            fill
            unoptimized
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition-[scale] duration-700 ease-(--ease-out) group-hover:scale-[1.03]"
          />
        </a>
      )}

      {setting?.mapUrl && (
        <a
          href={setting.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-brand-deep transition-[background-color,scale] duration-150 ease-(--ease-out) hover:bg-white/90 motion-safe:active:scale-[0.97]"
        >
          <MapPin className="size-4" />
          {t("openMap")}
        </a>
      )}
    </div>
  );
}
