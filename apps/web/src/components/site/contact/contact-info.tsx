import { ArrowUpRight, Clock, Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { FadeInImage } from "@/components/site/fade-in-image";
import { CONTACT_MAP_PLACEHOLDER } from "@/lib/page-banners";
import type { PublicSiteSetting } from "@/lib/public-api";
import { phoneHref } from "@/lib/site-links";

const contactButtonClass =
  "inline-flex h-12 min-w-0 items-center justify-center gap-2.5 rounded-control bg-paper px-4 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-brand-100 hover:text-brand-700";

interface ContactInfoProps {
  setting: PublicSiteSetting | null;
}

export async function ContactInfo({ setting }: ContactInfoProps) {
  const t = await getTranslations("contact");
  const mapImageUrl = setting?.mapImageUrl ?? CONTACT_MAP_PLACEHOLDER;
  const hasDetails = Boolean(
    setting?.address || setting?.workingHours || setting?.phone || setting?.email,
  );

  const mapImage = (
    <FadeInImage
      src={mapImageUrl}
      alt=""
      fill
      unoptimized
      sizes="(min-width: 1024px) 50vw, 100vw"
      className="object-cover transition-[scale,opacity] duration-250 ease-out group-hover:scale-[1.04] group-hover:duration-500 motion-reduce:transition-none"
    />
  );

  return (
    <div className="relative grid min-h-140 content-end overflow-hidden rounded-card bg-surface p-3 sm:p-4">
      {setting?.mapUrl ? (
        <a
          href={setting.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden
          className="group absolute inset-0"
        >
          {mapImage}
        </a>
      ) : (
        <div className="absolute inset-0">{mapImage}</div>
      )}

      {hasDetails && (
        <div className="relative grid gap-6 rounded-card bg-white p-6 shadow-[0_24px_48px_-24px_color-mix(in_srgb,var(--color-brand-night)_45%,transparent)] sm:p-8">
          <div className="grid gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 className="type-h4">{t("address")}</h2>
              {setting?.mapUrl && (
                <a
                  href={setting.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
                >
                  {t("openMap")}
                  <ArrowUpRight className="size-4" />
                </a>
              )}
            </div>
            {setting?.address && (
              <p className="text-base leading-relaxed whitespace-pre-line text-ink-2">
                {setting.address}
              </p>
            )}
            {setting?.workingHours && (
              <p className="flex items-center gap-2 text-sm text-ink-2">
                <Clock className="size-4.5 shrink-0 text-brand" strokeWidth={1.5} />
                {t("hours")}: {setting.workingHours}
              </p>
            )}
          </div>

          {(setting?.phone || setting?.email) && (
            <div className="grid gap-3 sm:grid-cols-2">
              {setting.phone && (
                <a href={phoneHref(setting.phone)} className={contactButtonClass}>
                  <Phone className="size-4.5 shrink-0 text-brand" strokeWidth={1.5} />
                  <span className="truncate">{setting.phone}</span>
                </a>
              )}
              {setting.email && (
                <a href={`mailto:${setting.email}`} className={contactButtonClass}>
                  <Mail className="size-4.5 shrink-0 text-brand" strokeWidth={1.5} />
                  <span className="truncate">{setting.email}</span>
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
