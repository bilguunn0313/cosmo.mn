import Image from "next/image";
import { imageFrameStyle } from "@/lib/image-frame";
import type { PublicProduct } from "@/lib/public-api";
import { cn } from "@/lib/utils";
import { BRAND_TILE_BACKGROUND } from "./brand-tile-background";

const CUTOUT_IMAGE_CLASS = "object-contain p-[14%] mix-blend-multiply";
const PHOTO_IMAGE_CLASS = "object-cover";

function imageClass(product: PublicProduct) {
  return product.imageIsCutout ? CUTOUT_IMAGE_CLASS : PHOTO_IMAGE_CLASS;
}

function imageStyle(product: PublicProduct) {
  return product.imageIsCutout ? undefined : imageFrameStyle(product.imageUrl);
}

interface ProductCardProps {
  product: PublicProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col gap-1.5">
      <div
        className={cn(
          "relative mb-3 aspect-square overflow-hidden rounded-card",
          BRAND_TILE_BACKGROUND,
        )}
      >
        <Image
          src={product.imageUrl}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 1024px) 320px, (min-width: 768px) 33vw, 50vw"
          style={imageStyle(product)}
          className={imageClass(product)}
        />
      </div>
      <h3 className="font-display text-base leading-snug font-semibold text-balance text-ink md:text-lg">
        {product.name}
      </h3>
      {product.description && (
        <p className="text-sm leading-relaxed text-pretty whitespace-pre-line text-ink-2">
          {product.description}
        </p>
      )}
    </article>
  );
}

export function ProductFeature({ product }: ProductCardProps) {
  return (
    <article className="grid items-center gap-8 lg:grid-cols-[5fr_6fr] lg:gap-14">
      <div
        className={cn(
          "relative aspect-5/4 overflow-hidden rounded-[24px]",
          BRAND_TILE_BACKGROUND,
        )}
      >
        <Image
          src={product.imageUrl}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 1024px) 560px, 100vw"
          style={imageStyle(product)}
          className={imageClass(product)}
        />
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="type-display text-balance text-ink">{product.name}</h3>
        {product.description && (
          <p className="max-w-[46ch] text-lg leading-relaxed text-pretty whitespace-pre-line text-ink-2">
            {product.description}
          </p>
        )}
      </div>
    </article>
  );
}
