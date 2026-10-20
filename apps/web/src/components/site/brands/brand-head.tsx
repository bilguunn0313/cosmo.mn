import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { CountryFlag } from "@/components/site/country-flag";
import { BannerImage } from "@/components/site/page-banner";
import { Reveal } from "@/components/site/reveal";
import { Link } from "@/i18n/navigation";
import type { PublicBrandDetail } from "@/lib/public-api";
import { cn } from "@/lib/utils";

function displayHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

interface BrandFact {
  label: string;
  value: React.ReactNode;
}

interface BrandHeadProps {
  brand: PublicBrandDetail;
  countryName: string | null;
}

export async function BrandHead({ brand, countryName }: BrandHeadProps) {
  const t = await getTranslations();
  const categoryNames = brand.categories
    .map((category) => t(`categories.${category}`))
    .join(", ");

  const facts: BrandFact[] = [];

  if (countryName && brand.originCountry) {
    facts.push({
      label: t("brands.origin"),
      value: (
        <span className="inline-flex items-center gap-2.5">
          <CountryFlag code={brand.originCountry} />
          {countryName}
        </span>
      ),
    });
  }

  if (brand.products.length > 0) {
    facts.push({
      label: t("brands.products"),
      value: brand.products.length,
    });
  }

  if (brand.websiteUrl) {
    facts.push({
      label: t("brands.website"),
      value: (
        <a
          href={brand.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-brand-700 transition-colors duration-150 hover:text-brand"
        >
          {displayHost(brand.websiteUrl)}
          <ArrowUpRight className="size-4.5" />
        </a>
      ),
    });
  }

  return (
    <>
      {brand.coverUrl && <BannerImage imageUrl={brand.coverUrl} />}

      <section
        aria-labelledby="brand-title"
        className={cn("site-container", !brand.coverUrl && "pt-8 md:pt-12")}
      >
        <div className="grid items-end gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-8 lg:gap-x-12">
          <Reveal
            className={cn(
              "relative z-10 aspect-square w-32 border border-rule bg-white sm:w-44 lg:w-52",
              brand.coverUrl && "-mt-16 sm:-mt-22 lg:-mt-26",
            )}
          >
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                fill
                unoptimized
                priority
                sizes="208px"
                className="object-contain p-[14%]"
              />
            ) : (
              <span className="absolute inset-0 grid place-items-center p-4 text-center text-2xl font-semibold tracking-heading text-ink-3">
                {brand.name}
              </span>
            )}
          </Reveal>

          <Reveal delay={0.1} className="grid justify-items-start gap-3">
            <Link
              href="/brands"
              className="group inline-flex items-center gap-2 py-1 text-sm font-medium text-brand-700"
            >
              <ArrowLeft className="size-4 transition-[translate] duration-200 ease-out group-hover:-translate-x-0.5" />
              {t("nav.brands")}
            </Link>
            <p className="eyebrow text-brand-700">
              {t("home.officialDistributor")} · {categoryNames}
            </p>
            <h1
              id="brand-title"
              className="type-display wrap-anywhere"
            >
              {brand.name}
            </h1>
          </Reveal>
        </div>

        {facts.length > 0 && (
          <Reveal delay={0.2}>
            <dl className="mt-8 grid grid-cols-2 border-t border-rule sm:grid-cols-3 lg:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="grid gap-1 pt-4 pr-4">
                  <dt className="text-[13px] text-ink-3">{fact.label}</dt>
                  <dd className="text-lg font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </section>
    </>
  );
}
