import { LOCALES } from "@cosmo/shared";

export const SITE_PAGES = [
  { path: "/", label: "Нүүр хуудас" },
  { path: "/about", label: "Бидний тухай" },
  { path: "/brands", label: "Брэндүүд" },
  { path: "/human-resources", label: "Хүний нөөц" },
  { path: "/media", label: "Медиа" },
  { path: "/contact", label: "Холбоо барих" },
];

export function brandPath(slug: string) {
  return `/brands/${slug}`;
}

export function newsPath(slug: string) {
  return `/media/${slug}`;
}

export function isExternalUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

const LOCALE_PREFIX = new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`);

export function normalizeInternalPath(path: string) {
  const withoutLocale = path.replace(LOCALE_PREFIX, "");
  return withoutLocale === "" ? "/" : withoutLocale;
}

export function toStoredLink(value: string) {
  if (value === "") {
    return null;
  }

  return isExternalUrl(value) ? value : normalizeInternalPath(value);
}

export function isValidLink(value: string) {
  if (value === "" || value.startsWith("/")) {
    return true;
  }

  if (!isExternalUrl(value)) {
    return false;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
