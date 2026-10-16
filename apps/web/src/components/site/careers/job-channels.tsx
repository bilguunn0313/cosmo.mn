import { ArrowUpRight, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HR_FACTS } from "@/lib/hr-facts";
import type { PublicSiteSetting } from "@/lib/public-api";
import { phoneHref } from "@/lib/site-links";

interface JobChannel {
  key: string;
  name: string;
  description: string;
  href: string;
  isPhone: boolean;
}

interface JobChannelsProps {
  setting: PublicSiteSetting | null;
}

export async function JobChannels({ setting }: JobChannelsProps) {
  const t = await getTranslations("careers");

  const channels: JobChannel[] = [
    {
      key: "zangia",
      name: "Zangia.mn",
      description: t("channels.zangia"),
      href: HR_FACTS.jobChannels.zangia,
      isPhone: false,
    },
    {
      key: "unegui",
      name: "Unegui.mn",
      description: t("channels.unegui"),
      href: HR_FACTS.jobChannels.unegui,
      isPhone: false,
    },
  ];

  if (setting?.facebookUrl) {
    channels.push({
      key: "facebook",
      name: "Facebook",
      description: t("channels.facebook"),
      href: setting.facebookUrl,
      isPhone: false,
    });
  }

  if (setting?.phone) {
    channels.push({
      key: "phone",
      name: setting.phone,
      description: t("channels.phone"),
      href: phoneHref(setting.phone),
      isPhone: true,
    });
  }

  return (
    <section
      id="jobs"
      aria-labelledby="jobs-title"
      className="site-container scroll-mt-28 pt-20 md:pt-36"
    >
      <div className="grid gap-3 border-b border-rule pb-5">
        <h2
          id="jobs-title"
          className="text-[clamp(40px,4.4vw,64px)] leading-none font-semibold tracking-[-0.04em]"
        >
          {t("openJobs")}
        </h2>
        <p className="text-[17px] text-ink-2">{t("jobsNote")}</p>
      </div>

      <ul>
        {channels.map((channel) => (
          <li key={channel.key} className="border-b border-rule">
            <a
              href={channel.href}
              target={channel.isPhone ? undefined : "_blank"}
              rel={channel.isPhone ? undefined : "noopener noreferrer"}
              className="group grid grid-cols-[minmax(0,1fr)_32px] items-center gap-x-6 gap-y-1 py-6 transition-[background-color,padding] duration-300 ease-out hover:bg-brand-100 md:grid-cols-[minmax(0,4fr)_minmax(0,6fr)_48px] md:py-7 md:hover:px-4"
            >
              <span className="text-[clamp(28px,3vw,44px)] font-semibold tracking-heading tabular-nums">
                {channel.name}
              </span>
              <span className="col-start-1 text-base text-ink-3 md:col-start-auto md:text-[17px]">
                {channel.description}
              </span>
              <span className="col-start-2 row-span-2 row-start-1 justify-self-end text-brand md:col-start-auto md:row-span-1 md:row-start-auto">
                {channel.isPhone ? (
                  <Phone className="size-7 md:size-8" />
                ) : (
                  <ArrowUpRight className="size-7 md:size-8" />
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
