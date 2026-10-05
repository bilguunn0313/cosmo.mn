import { escapeHtml } from './escape-html';

describe('escapeHtml', () => {
  it('HTML тусгай тэмдэгтүүдийг escape хийнэ', () => {
    expect(escapeHtml(`<script>alert("x" & 'y')</script>`)).toBe(
      '&lt;script&gt;alert(&quot;x&quot; &amp; &#39;y&#39;)&lt;/script&gt;',
    );
  });

  it('энгийн текстийг өөрчлөхгүй', () => {
    expect(escapeHtml('Сайн байна уу')).toBe('Сайн байна уу');
  });
});
