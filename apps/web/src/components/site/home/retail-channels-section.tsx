import { getTranslations } from "next-intl/server";
import {
  OnlineShopIcon,
  ServingIcon,
  ShoppingIcon,
  StoreIcon,
  WarehouseIcon,
} from "@/components/site/brand-icons";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { ChannelNetwork } from "./channel-network";

const CHANNELS = [
  { key: "modernTrade", icon: ShoppingIcon },
  { key: "traditionalTrade", icon: StoreIcon },
  { key: "wholesale", icon: WarehouseIcon },
  { key: "horeca", icon: ServingIcon },
  { key: "ecommerce", icon: OnlineShopIcon },
] as const;

export async function RetailChannelsSection() {
  const t = await getTranslations("home.channels");
  const channels = CHANNELS.map((channel) => ({
    key: channel.key,
    name: t(`items.${channel.key}`),
    icon: <channel.icon />,
  }));

  return (
    <section
      aria-labelledby="channels-title"
      className="channels-section relative isolate overflow-hidden py-20 text-white md:py-26"
    >
      <LogoMark className="absolute top-1/2 -left-48 -z-10 w-150 -translate-y-1/2 text-white/6" />

      <div className="site-container">
        <Reveal className="flex justify-center">
          <SectionEyebrow
            as="h2"
            id="channels-title"
            tone="white"
            className="text-base md:text-lg"
          >
            {t("eyebrow")}
          </SectionEyebrow>
        </Reveal>

        <ChannelNetwork channels={channels} hubLabel={t("hub")} />
      </div>
    </section>
  );
}
