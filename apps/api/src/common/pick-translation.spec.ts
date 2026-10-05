import { pickTranslation } from './pick-translation';

describe('pickTranslation', () => {
  const translations = [
    { locale: 'mn', title: 'Сайн байна уу' },
    { locale: 'en', title: 'Hello' },
  ];

  it('хүссэн хэлний орчуулгыг буцаана', () => {
    expect(pickTranslation(translations, 'en')?.title).toBe('Hello');
  });

  it('хүссэн хэл байхгүй бол монгол орчуулгыг буцаана', () => {
    expect(pickTranslation(translations, 'zh')?.title).toBe('Сайн байна уу');
  });

  it('орчуулга огт байхгүй бол undefined буцаана', () => {
    expect(pickTranslation([], 'mn')).toBeUndefined();
  });
});
