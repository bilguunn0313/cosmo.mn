import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import type { PublicProduct } from "@/lib/public-api";

const REVEAL_COLUMNS = 4;

interface ProductGridProps {
  products: PublicProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.id}>
          <Reveal
            index={index % REVEAL_COLUMNS}
            className="grid h-full overflow-hidden rounded-3xl bg-card md:rounded-[2rem]"
          >
            <div className="relative aspect-square">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                unoptimized
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-contain p-6 md:p-10"
              />
            </div>
            <div className="grid content-start gap-1.5 border-t border-foreground/5 px-5 py-4 md:px-6 md:py-5">
              <h3 className="text-base font-semibold tracking-tight md:text-lg">
                {product.name}
              </h3>
              {product.description && (
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {product.description}
                </p>
              )}
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
