import { slugify, slugSchema } from '@cosmo/shared';

describe('slugify', () => {
  it('монгол кирилл үсгийг латин болгоно', () => {
    expect(slugify('Хүнсний бүтээгдэхүүн')).toBe('khunsnii-buteegdekhuun');
  });

  it('латин нэрийг жижиг үсэг, зураастай болгоно', () => {
    expect(slugify('Lindt & Sprüngli')).toBe('lindt-sprungli');
  });

  it('тусгай тэмдэгт, илүү зайг арилгана', () => {
    expect(slugify('  Nivea   Men!!  ')).toBe('nivea-men');
  });

  it('үр дүн нь API-ийн slug шалгалтыг давна', () => {
    for (const name of ['Шинэ брэнд 2026', 'L’Oréal Paris', 'Ёстой Ч Цагаан']) {
      expect(slugSchema.safeParse(slugify(name)).success).toBe(true);
    }
  });
});
