export const SITE_NAV = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/brands", key: "brands" },
  { href: "/human-resources", key: "careers" },
  { href: "/media", key: "media" },
  { href: "/contact", key: "contact" },
] as const;

export const CONTACT_HREF = "/contact";

export const PAGE_BANNER_ID = "page-banner";

export function isNavItemActive(href: string, pathname: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
