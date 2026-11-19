const PARAGRAPH = /<p(\s[^>]*)?>([\s\S]*?)<\/p>/g;
const LINE_BREAK = /<br\s*\/?>/g;

export function paragraphsFromLineBreaks(html: string) {
  return html.replace(
    PARAGRAPH,
    (paragraph, attributes: string = "", inner: string) => {
      const lines = inner
        .split(LINE_BREAK)
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length <= 1) {
        return paragraph;
      }

      return lines.map((line) => `<p${attributes}>${line}</p>`).join("");
    },
  );
}
