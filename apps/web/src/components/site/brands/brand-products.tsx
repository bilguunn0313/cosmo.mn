import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { GridFillers } from "@/components/site/grid-fillers";
import { Reveal } from "@/components/site/reveal";
import type { PublicProduct } from "@/lib/public-api";
import { cn } from "@/lib/utils";

const REVEAL_COLUMNS = 3;

interface BrandProductsProps {
  products: PublicProduct[];
  summary: string | null;
}

export async function BrandProducts({ products, summary }: BrandProductsProps) {
  const t = await getTranslations("brands");

  return (
    <section
      aria-labelledby="brand-products-title"
      className="site-container pt-20 md:pt-28"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 pb-5">
        <h2
          id="brand-products-title"
          className="text-[clamp(40px,4.4vw,64px)] leading-none font-semibold tracking-heading"
        >
          {t("products")}
        </h2>
        <span className="text-sm text-ink-3">
          {t("productCount", { count: products.length })}
        </span>
      </div>

      <div className="grid gap-8 pt-10 pb-12 md:pt-12 md:pb-16 lg:grid-cols-12 lg:gap-x-6">
        {summary && (
          <p className="text-base leading-relaxed text-pretty text-ink-2 lg:sticky lg:top-28 lg:col-span-4 lg:self-start lg:pr-4">
            {summary}
          </p>
        )}

        <ul
          className={cn(
            "grid grid-cols-2 gap-px self-start border border-rule bg-rule md:grid-cols-3",
            summary ? "lg:col-span-8" : "lg:col-span-12 xl:grid-cols-4",
          )}
        >
          {products.map((product, index) => (
            <li key={product.id} className="bg-paper">
              <Reveal
                index={index % REVEAL_COLUMNS}
                className="flex h-full flex-col"
              >
                <div className="relative h-40 bg-white sm:h-55">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 22vw, (min-width: 768px) 33vw, 50vw"
                    className="object-contain p-5 sm:p-6"
                  />
                </div>
                <div className="grid flex-1 content-start gap-2 border-t border-rule px-4 pt-4 pb-5 sm:px-5 sm:pt-4.5">
                  <h3 className="text-[17px] leading-[1.3] font-medium">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="line-clamp-3 text-sm leading-normal text-ink-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
          <GridFillers
            itemCount={products.length}
            columns={{ base: 2, md: 3, xl: summary ? 3 : 4 }}
          />
        </ul>
      </div>
    </section>
  );
}
