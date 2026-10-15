export interface CatalogConfig {
  year: number;
  viewerUrl: string | null;
  pages: string[];
}

export const CATALOG: CatalogConfig = {
  year: 2026,
  viewerUrl: null,
  pages: [],
};
