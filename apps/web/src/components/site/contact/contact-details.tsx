import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { PublicSiteSetting } from "@/lib/public-api";
import { phoneHref } from "@/lib/site-links";

interface DetailRow {
  icon: typeof MapPin;
  label: string;
  value: React.ReactNode;
}

const linkClass =
  "group inline-flex items-center gap-2 justify-self-start text-[15px] font-medium text-brand-700 transition-colors duration-150 hover:text-brand";

interface ContactDetailsProps {
  setting: PublicSiteSetting | null;
}

export async function ContactDetails({ setting }: ContactDetailsProps) {
  const t = await getTranslations("contact");
  const rows: DetailRow[] = [];

  if (setting?.address) {
    rows.push({
      icon: MapPin,
      label: t("address"),
      value: <span className="whitespace-pre-line">{setting.address}</span>,
    });
  }

  if (setting?.workingHours) {
    rows.push({ icon: Clock, label: t("hours"), value: setting.workingHours });
  }

  if (setting?.phone) {
    rows.push({
      icon: Phone,
      label: t("phoneLabel"),
      value: (
        <a
          href={phoneHref(setting.phone)}
          className="font-medium text-brand-700 hover:text-brand"
        >
          {setting.phone}
        </a>
      ),
    });
  }

  if (setting?.email) {
    rows.push({
      icon: Mail,
      label: t("emailLabel"),
      value: (
        <a
          href={`mailto:${setting.email}`}
          className="font-medium text-brand-700 hover:text-brand"
        >
          {setting.email}
        </a>
      ),
    });
  }

  return (
    <div className="grid w-full gap-6">
      {rows.length > 0 && (
        <dl className="grid">
          {rows.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="grid grid-cols-[112px_minmax(0,1fr)] gap-4 border-t border-rule py-3.5 first:border-t-0 sm:grid-cols-[132px_minmax(0,1fr)]"
            >
              <dt className="flex items-center gap-2.5 self-start pt-0.5 text-sm text-ink-2">
                <Icon
                  className="size-4.5 shrink-0 text-brand"
                  strokeWidth={1.5}
                />
                {label}
              </dt>
              <dd className="text-[15px] leading-relaxed text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {setting?.mapUrl && (
        <a
          href={setting.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {t("directions")}
          <ArrowUpRight className="size-4.5 transition-[translate] duration-200 ease-(--ease-out) group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      )}
    </div>
  );
}
