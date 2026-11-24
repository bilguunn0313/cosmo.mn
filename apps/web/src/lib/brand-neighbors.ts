import type { PublicBrand } from "@/lib/public-api";

export interface BrandNeighbors {
  previous: PublicBrand;
  next: PublicBrand;
  position: number;
  total: number;
}

export function brandNeighbors(
  brands: PublicBrand[],
  slug: string,
): BrandNeighbors | null {
  const index = brands.findIndex((brand) => brand.slug === slug);
  const total = brands.length;

  if (index === -1 || total < 2) {
    return null;
  }

  return {
    previous: brands[(index - 1 + total) % total],
    next: brands[(index + 1) % total],
    position: index + 1,
    total,
  };
}
