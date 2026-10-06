const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function plainTextToHtml(text: string) {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => escapeHtml(paragraph.trim()).replaceAll("\n", "<br />"))
    .filter((paragraph) => paragraph !== "")
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

export function isHtmlEmpty(html: string) {
  return htmlToPlainText(html) === "" && !/<img\b/i.test(html);
}

export function htmlToPlainText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (entity) => HTML_ENTITIES[entity])
    .trim();
}
