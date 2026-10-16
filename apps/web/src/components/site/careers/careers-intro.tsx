import { ArrowDown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteButtonClass } from "@/components/site/site-button";

export async function CareersIntro() {
  const t = await getTranslations();

  return (
    <section className="site-container pt-12 md:pt-24">
      <p className="eyebrow animate-in fade-in slide-in-from-bottom-6 text-ink-3 duration-800 ease-(--ease-out) fill-mode-both">
        {t("nav.careers")}
      </p>
      <div className="mt-6 grid items-end gap-8 lg:grid-cols-12 lg:gap-x-6">
        <h1 className="animate-in fade-in slide-in-from-bottom-6 text-[clamp(56px,8.4vw,136px)] leading-[0.9] font-semibold tracking-[-0.055em] text-balance duration-1000 ease-(--ease-out) fill-mode-both delay-75 lg:col-span-8">
          {t("careers.joinTitle")}
        </h1>
        <div className="animate-in fade-in slide-in-from-bottom-6 grid justify-items-start gap-5 duration-1000 ease-(--ease-out) fill-mode-both delay-300 lg:col-span-4">
          <p className="text-lg leading-normal text-pretty text-ink-2 md:text-[19px]">
            {t("careers.description")}
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="#anket" className={siteButtonClass("primary", "min-w-50")}>
              {t("careers.fillForm")}
              <ArrowDown className="size-4.5" />
            </a>
            <a href="#jobs" className={siteButtonClass("secondary")}>
              {t("careers.openJobs")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
