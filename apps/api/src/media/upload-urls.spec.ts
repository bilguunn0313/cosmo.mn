import { uploadUrlsIn } from './upload-urls';

describe('uploadUrlsIn', () => {
  it('текст доторх зургийн хаягуудыг олно', () => {
    const html =
      '<p>Текст</p><img src="/uploads/images/a.webp"><img src="/uploads/images/b.webp?frame=50,50,1">';

    expect(uploadUrlsIn(html)).toEqual([
      '/uploads/images/a.webp',
      '/uploads/images/b.webp',
    ]);
  });

  it('зураггүй текстэд хоосон жагсаалт буцаана', () => {
    expect(uploadUrlsIn('<p>Сайн байна уу</p>')).toEqual([]);
  });
});
