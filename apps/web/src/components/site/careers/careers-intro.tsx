import { ArrowDown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageBanner } from "@/components/site/page-banner";
import { siteButtonClass } from "@/components/site/site-button";

interface CareersIntroProps {
  imageUrl: string;
}

export async function CareersIntro({ imageUrl }: CareersIntroProps) {
  const t = await getTranslations("careers");

  return (
    <PageBanner
      title={t("joinTitle")}
      description={t("description")}
      imageUrl={imageUrl}
    >
      <div className="flex flex-wrap gap-2">
        <a href="#anket" className={siteButtonClass("white", "min-w-50")}>
          {t("fillForm")}
          <ArrowDown className="size-4.5" />
        </a>
        <a href="#jobs" className={siteButtonClass("outlineWhite")}>
          {t("openJobs")}
        </a>
      </div>
    </PageBanner>
  );
}
