import {
  Clock,
  Pill,
  ShoppingBasket,
  ShoppingCart,
  Store,
  Warehouse,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { ChannelNetwork } from "./channel-network";
import { StatNumber } from "./stat-number";

const CHANNELS = [
  { key: "supermarket", icon: ShoppingBasket },
  { key: "hypermarket", icon: ShoppingCart },
  { key: "pharmacy", icon: Pill },
  { key: "wholesale", icon: Warehouse },
  { key: "convenience", icon: Clock },
  { key: "grocery", icon: Store },
] as const;

interface RetailChannelsSectionProps {
  salesPointCount: number | null;
}

export async function RetailChannelsSection({
  salesPointCount,
}: RetailChannelsSectionProps) {
  const t = await getTranslations("home.channels");
  const channels = CHANNELS.map((channel) => ({
    key: channel.key,
    label: t(`items.${channel.key}`),
    icon: <channel.icon aria-hidden className="text-white" strokeWidth={1.5} />,
  }));

  return (
    <section
      aria-labelledby="channels-title"
      className="relative isolate overflow-hidden bg-brand py-20 text-white md:py-26"
    >
      <LogoMark className="absolute top-1/2 -left-48 -z-10 w-150 -translate-y-1/2 text-white/6" />

      <div className="site-container">
        <Reveal className="flex flex-col items-center gap-4.5 text-center">
          <SectionEyebrow tone="white">{t("eyebrow")}</SectionEyebrow>
          <h2
            id="channels-title"
            className="type-section text-balance tabular-nums"
          >
            {salesPointCount
              ? t.rich("title", {
                  count: () => <StatNumber value={salesPointCount} />,
                })
              : t("titlePlain")}
          </h2>
          <p className="text-lg text-pretty text-night-text">{t("text")}</p>
        </Reveal>

        <ChannelNetwork channels={channels} hubLabel={t("hub")} />
      </div>
    </section>
  );
}
