import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { CountryFlag } from "@/components/site/country-flag";
import { ImageReveal } from "@/components/site/image-reveal";
import { Reveal } from "@/components/site/reveal";
import { Link } from "@/i18n/navigation";
import type { PublicBrandDetail } from "@/lib/public-api";

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
      <section aria-labelledby="brand-title" className="site-container pt-6 md:pt-8">
        <nav className="flex flex-wrap items-center gap-2.5 text-sm font-medium">
          <Link
            href="/brands"
            className="group inline-flex items-center gap-2 py-1.5 text-brand-700"
          >
            <ArrowLeft className="size-4 transition-[translate] duration-200 ease-out group-hover:-translate-x-0.5" />
            {t("nav.brands")}
          </Link>
          <span aria-hidden className="text-ink-3">
            /
          </span>
          <span className="text-ink-3">{categoryNames}</span>
          <span aria-hidden className="text-ink-3">
            /
          </span>
          <span aria-current="page">{brand.name}</span>
        </nav>

        <div className="mt-8 grid items-end gap-8 md:mt-10 lg:grid-cols-12 lg:gap-x-6">
          <Reveal className="relative aspect-square w-40 border-2 border-rule bg-white sm:w-56 lg:col-span-3 lg:w-auto">
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                fill
                unoptimized
                priority
                sizes="(min-width: 1024px) 25vw, 224px"
                className="object-contain p-[14%]"
              />
            ) : (
              <span className="absolute inset-0 grid place-items-center text-3xl font-semibold tracking-heading text-ink-3">
                {brand.name}
              </span>
            )}
          </Reveal>

          <Reveal
            delay={0.1}
            className="grid gap-6 lg:col-span-8 lg:col-start-5"
          >
            <p className="eyebrow text-brand-700">
              {t("home.officialDistributor")} · {categoryNames}
            </p>
            <h1
              id="brand-title"
              className="text-[clamp(56px,9vw,148px)] leading-[0.88] font-semibold tracking-heading wrap-anywhere"
            >
              {brand.name}
            </h1>
            {facts.length > 0 && (
              <dl className="grid grid-cols-2 border-t-2 border-rule sm:grid-cols-3">
                {facts.map((fact) => (
                  <div key={fact.label} className="grid gap-1 pt-4 pr-4">
                    <dt className="text-[13px] text-ink-3">{fact.label}</dt>
                    <dd className="text-[22px] font-medium">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>
        </div>
      </section>

      {brand.coverUrl && (
        <div className="site-container mt-10 md:mt-14">
          <div className="relative h-[min(60vh,540px)] overflow-hidden bg-surface">
            <ImageReveal delay={0.2}>
              <Image
                src={brand.coverUrl}
                alt=""
                fill
                unoptimized
                priority
                sizes="100vw"
                className="object-cover"
              />
            </ImageReveal>
          </div>
        </div>
      )}
    </>
  );
}
