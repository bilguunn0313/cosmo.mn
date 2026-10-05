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

  it('слайдад ашиглагдаж байгаа файлыг устгахгүй', async () => {
    const upload = await context.admin
      .post('/admin/media')
      .attach('file', await createTestImage(), {
        filename: 'c.png',
        contentType: 'image/png',
      })
      .expect(201);

    await context.admin
      .post('/admin/slides')
      .send({
        mediaId: upload.body.id,
        translations: [{ locale: 'mn', title: 'Слайд' }],
      })
      .expect(201);

    await context.admin.delete(`/admin/media/${upload.body.id}`).expect(400);
  });
});
