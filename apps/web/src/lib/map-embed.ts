import { MAP_EMBED_PREFIX } from "@cosmo/shared";

export function extractMapEmbedUrl(value: string) {
  const source = value.match(/src="([^"]+)"/)?.[1] ?? value.trim();

  return source.startsWith(MAP_EMBED_PREFIX)
    ? source.replaceAll("&amp;", "&")
    : null;
}
