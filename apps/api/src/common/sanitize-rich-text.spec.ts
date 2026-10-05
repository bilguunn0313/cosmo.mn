import { sanitizeRichText } from './sanitize-rich-text';

describe('sanitizeRichText', () => {
  it('script tag-ийг устгана', () => {
    expect(sanitizeRichText('<p>Сайн</p><script>alert(1)</script>')).toBe(
      '<p>Сайн</p>',
    );
  });

  it('onerror зэрэг event attribute-уудыг устгана', () => {
    expect(sanitizeRichText('<img src="/a.webp" onerror="alert(1)">')).toBe(
      '<img src="/a.webp" />',
    );
  });

  it('YouTube iframe-ийг зөвшөөрнө', () => {
    const html = '<iframe src="https://www.youtube.com/embed/abc"></iframe>';
    expect(sanitizeRichText(html)).toBe(html);
  });

  it('бусад сайтын iframe-ийн src-ийг устгана', () => {
    expect(
      sanitizeRichText('<iframe src="https://evil.example/x"></iframe>'),
    ).toBe('<iframe></iframe>');
  });

  it('гарчиг, жагсаалт, холбоосыг хадгална', () => {
    const html =
      '<h2>Гарчиг</h2><ul><li>Нэг</li></ul><a href="https://cosmo.mn">холбоос</a>';
    expect(sanitizeRichText(html)).toBe(html);
  });
});
