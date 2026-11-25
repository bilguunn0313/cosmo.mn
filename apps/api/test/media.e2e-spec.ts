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

  it('зургийн гол цэг, томруулалтыг хадгалж нийтийн хаягт нэмнэ', async () => {
    const upload = await context.admin
      .post('/admin/media')
      .attach('file', await createTestImage(), {
        filename: 'frame.png',
        contentType: 'image/png',
      })
      .expect(201);
    expect(upload.body).toMatchObject({ focusX: 50, focusY: 50, zoom: 1 });

    const frame = { focusX: 25, focusY: 35, zoom: 1.4 };
    const updated = await context.admin
      .patch(`/admin/media/${upload.body.id}`)
      .send(frame)
      .expect(200);
    expect(updated.body).toMatchObject(frame);

    await context.admin
      .put('/admin/site-settings')
      .send({ ceoImageId: upload.body.id })
      .expect(200);

    const setting = await context.guest
      .get('/public/site-settings')
      .expect(200);
    expect(setting.body.ceoImageUrl).toBe(`${upload.body.url}?frame=25,35,1.4`);
    await context.guest.get(setting.body.ceoImageUrl).expect(200);
  });

  it('хэт их томруулалт, хүрээнээс гарсан цэгийг хүлээж авахгүй', async () => {
    const upload = await context.admin
      .post('/admin/media')
      .attach('file', await createTestImage(), {
        filename: 'frame-invalid.png',
        contentType: 'image/png',
      })
      .expect(201);

    await context.admin
      .patch(`/admin/media/${upload.body.id}`)
      .send({ focusX: 120, focusY: 50, zoom: 1 })
      .expect(400);
    await context.admin
      .patch(`/admin/media/${upload.body.id}`)
      .send({ focusX: 50, focusY: 50, zoom: 5 })
      .expect(400);
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
        .send({ mediaId: image.id })
        .expect(201);

      const response = await context.admin
        .delete(`/admin/media/${image.id}`)
        .expect(409);

      expect(response.body.usages).toEqual([
        expect.objectContaining({ type: 'slide' }),
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

    it('ашиглалтаас хассан файл автоматаар устна', async () => {
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

      await context.admin.get(`/admin/media/${image.id}/usages`).expect(404);
    });
  });
});
