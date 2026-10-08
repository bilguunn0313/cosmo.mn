import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function HeroFallback() {
  const t = await getTranslations();

  return (
    <section className="bg-brand-gradient flex h-[clamp(26rem,calc(100dvh-10rem),48rem)] items-end rounded-3xl p-6 text-white sm:p-10 md:rounded-[2rem] lg:p-14">
      <div className="grid max-w-3xl gap-6">
        <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {t("metadata.description")}
        </h2>
        <Link
          href="/about"
          className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-foreground transition-[background-color,scale] duration-150 ease-(--ease-out) hover:bg-white/90 motion-safe:active:scale-[0.97]"
        >
          {t("nav.about")}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
