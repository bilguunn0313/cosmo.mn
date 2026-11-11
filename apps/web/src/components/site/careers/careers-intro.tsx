import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageBanner } from "@/components/site/page-banner";
import { siteButtonClass } from "@/components/site/site-button";
import { Link } from "@/i18n/navigation";
import { JOBS_PATH } from "@/lib/site-links";

interface CareersIntroProps {
  imageUrl: string;
  hasOpenJobs: boolean;
}

export async function CareersIntro({
  imageUrl,
  hasOpenJobs,
}: CareersIntroProps) {
  const t = await getTranslations("careers");

  return (
    <PageBanner
      title={t("joinTitle")}
      description={t("description")}
      imageUrl={imageUrl}
    >
      {hasOpenJobs && (
        <Link href={JOBS_PATH} className={siteButtonClass("white", "min-w-50")}>
          {t("jobs.heroButton")}
          <ArrowRight className="size-4.5" />
        </Link>
      )}
    </PageBanner>
  );
}
