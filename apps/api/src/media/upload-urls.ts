const UPLOAD_URL_PATTERN = /\/uploads\/[^"'\s?#)]+/g;

export function uploadUrlsIn(html: string): string[] {
  return html.match(UPLOAD_URL_PATTERN) ?? [];
}
