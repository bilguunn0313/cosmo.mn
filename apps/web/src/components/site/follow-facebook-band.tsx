import { getTranslations } from "next-intl/server";
import { siFacebook } from "simple-icons";
import { LogoMark } from "./logo-mark";
import { Reveal } from "./reveal";
import { siteButtonClass } from "./site-button";
import { SocialIcon } from "./social-icon";

interface FollowFacebookBandProps {
  url: string;
}

export async function FollowFacebookBand({ url }: FollowFacebookBandProps) {
  const t = await getTranslations("media");

  return (
    <section
      aria-labelledby="follow-facebook-title"
      className="site-container pt-20 md:pt-28"
    >
      <Reveal className="relative isolate flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-card bg-paper px-6 py-8 md:px-12 md:py-10">
        <LogoMark className="absolute -top-12 -right-15 -z-10 w-65 text-brand/6" />
        <h2
          id="follow-facebook-title"
          className="type-h3 leading-tight font-semibold text-balance text-ink"
        >
          {t("followTitle")}
        </h2>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={siteButtonClass("primary", "px-6")}
        >
          <SocialIcon icon={siFacebook} className="size-5" />
          {t("followButton")}
        </a>
      </Reveal>
    </section>
  );
}
