import { type LucideIcon, Target, Telescope } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { ABOUT_CONTENT, SLOGAN_IMAGE_PLACEHOLDER } from "@/lib/about";
import { cn } from "@/lib/utils";

interface StatementCardProps {
  icon: LucideIcon;
  label: string;
  text: string;
  className: string;
  index: number;
}

function StatementCard({
  icon: Icon,
  label,
  text,
  className,
  index,
}: StatementCardProps) {
  return (
    <Reveal
      index={index}
      className={cn(
        "flex flex-col justify-between gap-8 rounded-card p-6 md:p-8",
        className,
      )}
    >
      <Icon aria-hidden strokeWidth={1.5} className="size-12 text-brand" />
      <div className="grid gap-3">
        <h3 className="type-h4">{label}</h3>
        <p className="max-w-130 text-base leading-relaxed text-pretty text-ink-2">
          {text}
        </p>
      </div>
    </Reveal>
  );
}

export async function PurposeSection() {
  const t = await getTranslations("about");

  return (
    <section
      aria-labelledby="purpose-title"
      className="site-container pt-20 md:pt-32"
    >
      <h2 id="purpose-title" className="type-h2 pb-8 md:pb-10">
        {t("purposeTitle")}
      </h2>

      <div className="grid gap-4 lg:h-[min(calc(100svh-14rem),640px)] lg:grid-cols-2 lg:grid-rows-2">
        <Reveal className="relative flex aspect-4/3 flex-col justify-end overflow-hidden rounded-card bg-brand-night p-6 text-white md:p-8 lg:row-span-2 lg:aspect-auto">
          <Image
            src={ABOUT_CONTENT.sloganImageUrl ?? SLOGAN_IMAGE_PLACEHOLDER}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-brand-night/90 via-brand-night/40 to-transparent"
          />
          <div className="relative grid gap-3">
            <h3 className="text-sm font-semibold text-brand-300">
              {t("sloganLabel")}
            </h3>
            <p className="type-h2 max-w-140 text-balance">{t("sloganText")}</p>
          </div>
        </Reveal>

        <StatementCard
          icon={Target}
          label={t("missionLabel")}
          text={t("missionText")}
          className="bg-brand-100"
          index={1}
        />
        <StatementCard
          icon={Telescope}
          label={t("visionLabel")}
          text={t("visionText")}
          className="bg-surface"
          index={2}
        />
      </div>
    </section>
  );
}
