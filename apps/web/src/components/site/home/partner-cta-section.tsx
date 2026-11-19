import { getTranslations } from "next-intl/server";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { siteButtonClass } from "@/components/site/site-button";
import { CONTACT_HREF } from "@/components/site/site-nav";
import { SmartLink } from "@/components/site/smart-link";
import { cn } from "@/lib/utils";

interface PartnerCtaSectionProps {
  eyebrow?: string;
  title?: string;
  text?: string;
  href?: string;
  buttonLabel?: string;
  isDark?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export async function PartnerCtaSection({
  eyebrow,
  title,
  text,
  href = CONTACT_HREF,
  buttonLabel,
  isDark = false,
  className,
  children,
}: PartnerCtaSectionProps) {
  const t = await getTranslations();

  return (
    <section
      aria-labelledby="partner-cta-title"
      data-flush-footer
      className={cn(
        "relative isolate overflow-hidden py-20 md:py-26",
        isDark ? "bg-brand-700 text-white" : "bg-brand-100",
        className,
      )}
    >
      <LogoMark
        className={cn(
          "absolute -bottom-50 -left-40 -z-10 w-155",
          isDark ? "text-white/6" : "text-brand/7",
        )}
      />

      <Reveal className="site-container flex max-w-205 flex-col items-center gap-5 text-center">
        <SectionEyebrow tone={isDark ? "white" : "coral"}>
          {eyebrow ?? t("home.partnerEyebrow")}
        </SectionEyebrow>
        <h2
          id="partner-cta-title"
          className={cn("type-section text-balance", !isDark && "text-ink")}
        >
          {title ?? t("home.cta.title")}
        </h2>
        <p
          className={cn(
            "text-lg text-pretty",
            isDark ? "text-brand-200" : "text-ink-2",
          )}
        >
          {text ?? t("home.cta.text")}
        </p>
        {children}
        <SmartLink
          href={href}
          className={siteButtonClass(
            isDark ? "white" : "primary",
            "mt-2 px-7 text-base font-medium",
          )}
        >
          {buttonLabel ?? t("nav.contact")}
        </SmartLink>
      </Reveal>
    </section>
  );
}
