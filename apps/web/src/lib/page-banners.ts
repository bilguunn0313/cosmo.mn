import type { BannerPage, PublicSiteSetting } from "./public-api";

function unsplashUrl(photoId: string) {
  return `https://images.unsplash.com/${photoId}?w=2400&q=80&auto=format&fit=crop`;
}

const STOCK_BANNERS: Record<BannerPage, string> = {
  about: unsplashUrl("photo-1586528116311-ad8dd3c8310d"),
  careers: unsplashUrl("photo-1522071820081-009f0129c71c"),
  media: unsplashUrl("photo-1504711434969-e33886168f5c"),
  brands: unsplashUrl("photo-1542838132-92c53300491e"),
};

export function pageBannerUrl(
  setting: PublicSiteSetting | null,
  page: BannerPage,
) {
  return setting?.pageBanners?.[page] ?? STOCK_BANNERS[page];
}
