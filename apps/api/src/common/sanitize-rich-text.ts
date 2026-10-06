import sanitizeHtml from 'sanitize-html';

const options: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    'img',
    'h1',
    'h2',
    'iframe',
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen'],
    '*': ['style'],
  },
  allowedStyles: {
    '*': {
      'text-align': [/^(left|right|center|justify)$/],
    },
  },
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs:
        attribs.target === '_blank'
          ? { ...attribs, rel: 'noopener noreferrer' }
          : attribs,
    }),
  },
  allowedIframeHostnames: [
    'www.youtube.com',
    'youtube.com',
    'www.youtube-nocookie.com',
  ],
};

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, options);
}
