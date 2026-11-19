import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { repeatToFill } from "@/lib/marquee";
import type { PublicRetailPartner } from "@/lib/public-api";
import { LogoMarquee } from "./logo-marquee";

const MAX_VISIBLE_TILES = 7;
const SECONDS_PER_TILE = 2.5;

interface RetailPartnersSectionProps {
  partners: PublicRetailPartner[];
}

export async function RetailPartnersSection({
  partners,
}: RetailPartnersSectionProps) {
  const t = await getTranslations("home.retail");

  if (partners.length === 0) {
    return null;
  }

  const tiles = repeatToFill(partners, MAX_VISIBLE_TILES + 1);

  return (
    <section
      aria-labelledby="retail-title"
      className="bg-brand-100 py-20 md:pt-26 md:pb-28"
    >
      <div className="site-container">
        <Reveal className="mx-auto mb-10 flex max-w-190 flex-col items-center gap-4.5 text-center md:mb-12">
          <h2 id="retail-title" className="type-section text-balance text-ink">
            {t("title")}
          </h2>
          <p className="text-lg text-pretty text-ink-2">{t("text")}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <LogoMarquee
            tileCount={tiles.length}
            secondsPerTile={SECONDS_PER_TILE}
            className="[mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]"
          >
            {tiles.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="mr-(--gap) flex aspect-square w-[calc((100cqw-(var(--count)-1)*var(--gap))/var(--count))] shrink-0 items-center justify-center rounded-2xl bg-white [--count:3] [--gap:10px] md:[--count:5] lg:[--count:7]"
              >
                <span className="relative h-1/2 w-2/3">
                  <Image
                    src={partner.logoUrl}
                    alt={index < partners.length ? partner.name : ""}
                    fill
                    unoptimized
                    sizes="180px"
                    className="object-contain"
                  />
                </span>
              </div>
            ))}
          </LogoMarquee>
        </Reveal>
      </div>
    </section>
  );
}
