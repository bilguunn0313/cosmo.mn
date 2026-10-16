// TODO: move to site settings / admin once the API exposes catalog pages.
export interface CatalogConfig {
  year: number;
  /** Optional hero image for /brands. Falls back to the first brand cover. */
  coverUrl: string | null;
  /** External flipbook viewer (e.g. heyzine). Opens in a new tab. */
  viewerUrl: string | null;
  /** Page images in order. Page 1 is the front cover. */
  pages: string[];
}

export const CATALOG: CatalogConfig = {
  year: 2026,
  coverUrl: null,
  viewerUrl: null,
  pages: [],
};
