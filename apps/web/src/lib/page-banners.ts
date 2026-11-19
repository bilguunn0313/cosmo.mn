import type { BannerPage, PublicSiteSetting } from "./public-api";

function unsplashUrl(photoId: string) {
  return `https://images.unsplash.com/${photoId}?w=2400&q=80&auto=format&fit=crop`;
}

const STOCK_BANNERS: Record<BannerPage, string> = {
  about: "/images/about/cosmo-aerial.webp",
  careers: unsplashUrl("photo-1552664730-d307ca884978"),
  media: unsplashUrl("photo-1475721027785-f74eccf877e2"),
  brands: unsplashUrl("photo-1578916171728-46686eac8d58"),
  contact: unsplashUrl("photo-1653380550474-56f0b47da4cf"),
  hrGovernance: unsplashUrl("photo-1786719664257-1bc47a776f4c"),
};

export function pageBannerUrl(
  setting: PublicSiteSetting | null,
  page: BannerPage,
) {
  return setting?.pageBanners?.[page] ?? STOCK_BANNERS[page];
}
