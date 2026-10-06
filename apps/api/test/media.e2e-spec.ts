import { createTestImage } from './helpers/fixtures';
import { createTestApp, TestContext } from './helpers/test-app';

describe('Media', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestApp();
  });

  afterAll(async () => {
    await context.app.close();
  });

  it('зургийг webp болгож, 2000px хүртэл багасгана', async () => {
    const response = await context.admin
      .post('/admin/media')
      .attach('file', await createTestImage(3000, 1500), {
        filename: 'зураг.png',
        contentType: 'image/png',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      type: 'IMAGE',
      mimeType: 'image/webp',
      width: 2000,
      height: 1000,
      originalName: 'зураг.png',
    });
    expect(response.body.url).toMatch(/^\/uploads\/images\/.+\.webp$/);
  });

  it('upload хийсэн зургийг /uploads хаягаар үйлчилнэ', async () => {
    const upload = await context.admin
      .post('/admin/media')
      .attach('file', await createTestImage(), {
        filename: 'a.png',
        contentType: 'image/png',
      })
      .expect(201);

    const file = await context.guest.get(upload.body.url).expect(200);
    expect(file.headers['content-type']).toBe('image/webp');
  });

  it('видеог VIDEO төрлөөр хадгална', async () => {
    const response = await context.admin
      .post('/admin/media')
      .attach('file', Buffer.from('fake video'), {
        filename: 'clip.mp4',
        contentType: 'video/mp4',
      })
      .expect(201);

    expect(response.body.type).toBe('VIDEO');
    expect(response.body.url).toMatch(/\.mp4$/);
  });

  it('зөвшөөрөгдөөгүй файлын төрлийг хүлээж авахгүй', async () => {
    await context.admin
      .post('/admin/media')
      .attach('file', Buffer.from('hello'), {
        filename: 'notes.txt',
        contentType: 'text/plain',
      })
      .expect(400);
  });

  it('файлгүй хүсэлтийг хүлээж авахгүй', async () => {
    await context.admin.post('/admin/media').expect(400);
  });

  it('төрлөөр шүүж жагсаана', async () => {
    const response = await context.admin
      .get('/admin/media?type=VIDEO')
      .expect(200);

    expect(response.body.items.length).toBeGreaterThan(0);
    expect(
      response.body.items.every(
        (item: { type: string }) => item.type === 'VIDEO',
      ),
    ).toBe(true);
  });

  it('устгахад файл нь хамт устана', async () => {
    const upload = await context.admin
      .post('/admin/media')
      .attach('file', await createTestImage(), {
        filename: 'b.png',
        contentType: 'image/png',
      })
      .expect(201);

    await context.admin.delete(`/admin/media/${upload.body.id}`).expect(204);
    await context.guest.get(upload.body.url).expect(404);
  });

  describe('Ашиглагдаж байгаа файлыг хамгаалах', () => {
    async function uploadImage() {
      const upload = await context.admin
        .post('/admin/media')
        .attach('file', await createTestImage(), {
          filename: 'used.png',
          contentType: 'image/png',
        })
        .expect(201);

      return upload.body as { id: number; url: string };
    }

    it('слайдад ашиглагдаж байгаа файлыг устгахгүй, хаана ашиглагдаж байгааг хэлнэ', async () => {
      const image = await uploadImage();
      await context.admin
        .post('/admin/slides')
        .send({
          mediaId: image.id,
          translations: [{ locale: 'mn', title: 'Нүүр слайд' }],
        })
        .expect(201);

      const response = await context.admin
        .delete(`/admin/media/${image.id}`)
        .expect(409);

      expect(response.body.usages).toEqual([
        expect.objectContaining({ type: 'slide', title: 'Нүүр слайд' }),
      ]);
    });

    it('брэндийн лого болсон файлыг устгахгүй', async () => {
      const image = await uploadImage();
      await context.admin
        .post('/admin/brands')
        .send({
          slug: 'logo-brand',
          categories: ['FOOD'],
          logoId: image.id,
          translations: [{ locale: 'mn', name: 'Логотой брэнд' }],
        })
        .expect(201);

      const response = await context.admin
        .delete(`/admin/media/${image.id}`)
        .expect(409);

      expect(response.body.usages).toEqual([
        expect.objectContaining({ type: 'brand', title: 'Логотой брэнд' }),
      ]);
    });

    it('мэдээний текстэн дотор оруулсан зургийг устгахгүй', async () => {
      const image = await uploadImage();
      await context.admin
        .post('/admin/news')
        .send({
          slug: 'news-with-image',
          translations: [
            {
              locale: 'mn',
              title: 'Зурагтай мэдээ',
              content: `<p>Текст</p><img src="${image.url}">`,
            },
          ],
        })
        .expect(201);

      const response = await context.admin
        .delete(`/admin/media/${image.id}`)
        .expect(409);

      expect(response.body.usages).toEqual([
        expect.objectContaining({ type: 'news', title: 'Зурагтай мэдээ' }),
      ]);
    });

    it('хуудасны хэсгийн текстэн дотор оруулсан зургийг устгахгүй', async () => {
      const image = await uploadImage();
      await context.admin
        .post('/admin/sections')
        .send({
          page: 'about',
          translations: [
            {
              locale: 'mn',
              title: 'Түүх',
              body: `<img src="${image.url}">`,
            },
          ],
        })
        .expect(201);

      await context.admin.delete(`/admin/media/${image.id}`).expect(409);
    });

    it('файл хаана ашиглагдаж байгааг устгахаас өмнө харуулна', async () => {
      const image = await uploadImage();
      const unused = await uploadImage();
      await context.admin
        .post('/admin/news')
        .send({
          slug: 'cover-news',
          coverImageId: image.id,
          translations: [
            { locale: 'mn', title: 'Нүүр зурагтай', content: '<p>x</p>' },
          ],
        })
        .expect(201);

      const used = await context.admin
        .get(`/admin/media/${image.id}/usages`)
        .expect(200);
      const notUsed = await context.admin
        .get(`/admin/media/${unused.id}/usages`)
        .expect(200);

      expect(used.body).toEqual([
        expect.objectContaining({ type: 'news', title: 'Нүүр зурагтай' }),
      ]);
      expect(notUsed.body).toEqual([]);
    });

    it('ашиглалтаас хассаны дараа устгаж болно', async () => {
      const image = await uploadImage();
      const brand = await context.admin
        .post('/admin/brands')
        .send({
          slug: 'temp-logo-brand',
          categories: ['FOOD'],
          logoId: image.id,
          translations: [{ locale: 'mn', name: 'Түр' }],
        })
        .expect(201);

      await context.admin
        .patch(`/admin/brands/${brand.body.id}`)
        .send({ logoId: null })
        .expect(200);

      await context.admin.delete(`/admin/media/${image.id}`).expect(204);
    });
  });
});
