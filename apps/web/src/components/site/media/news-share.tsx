import { getTranslations } from "next-intl/server";
import { siFacebook } from "simple-icons";
import { CopyLinkButton } from "@/components/site/copy-link-button";
import { SocialIcon } from "@/components/site/social-icon";
import type { Locale } from "@/lib/types";
import { localizedPath, SITE_URL } from "@/lib/seo";
import { newsPath } from "@/lib/site-links";

interface NewsShareProps {
  slug: string;
  locale: Locale;
}

export async function NewsShare({ slug, locale }: NewsShareProps) {
  const t = await getTranslations();
  const pageUrl = `${SITE_URL}${localizedPath(locale, newsPath(slug))}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule pt-6">
      <span className="text-sm font-semibold text-ink-2">
        {t("media.share")}
      </span>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 py-1 text-[15px] font-medium text-brand-700 outline-offset-3 outline-brand transition-colors duration-150 hover:text-brand focus-visible:outline-2"
      >
        <SocialIcon icon={siFacebook} className="size-4.5" />
        Facebook
      </a>
      <CopyLinkButton
        label={t("careers.jobs.copyLink")}
        copiedLabel={t("careers.jobs.copied")}
      />
    </div>
  );
}
