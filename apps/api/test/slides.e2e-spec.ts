import { createTestVideo, uploadTestImage } from './helpers/fixtures';
import { createTestApp, TestContext } from './helpers/test-app';

describe('Slides', () => {
  let context: TestContext;
  let videoId: number;
  let posterId: number;

  beforeAll(async () => {
    context = await createTestApp();
    videoId = await createTestVideo(context);
    posterId = await uploadTestImage(context);
  });

  afterAll(async () => {
    await context.app.close();
  });

  function createSlide(title: string, isActive = true) {
    return context.admin
      .post('/admin/slides')
      .send({
        mediaId: videoId,
        posterId,
        linkUrl: '/mn/brands',
        isActive,
        translations: [
          { locale: 'mn', title },
          { locale: 'en', title: `${title} EN` },
        ],
      })
      .expect(201);
  }

  it('видео слайдыг poster зурагтай нь үүсгэнэ', async () => {
    const response = await createSlide('Эхний слайд');

    expect(response.body.media.type).toBe('VIDEO');
    expect(response.body.poster.id).toBe(posterId);
    expect(response.body.translations).toHaveLength(2);
  });

  it('шинэ слайдыг хамгийн сүүлд байрлуулна', async () => {
    const first = await createSlide('Нэг');
    const second = await createSlide('Хоёр');

    expect(second.body.order).toBe(first.body.order + 1);
  });

  it('монгол орчуулгагүй слайдыг хүлээж авахгүй', async () => {
    const response = await context.admin
      .post('/admin/slides')
      .send({ mediaId: videoId, translations: [{ locale: 'en', title: 'x' }] })
      .expect(400);

    expect(JSON.stringify(response.body)).toContain('Монгол орчуулга');
  });

  it('нийтийн API зөвхөн идэвхтэй слайдуудыг сонгосон хэлээр буцаана', async () => {
    await createSlide('Нуусан слайд', false);

    const response = await context.guest
      .get('/public/slides?locale=en')
      .expect(200);

    const titles = response.body.map((slide: { title: string }) => slide.title);
    expect(titles).toContain('Эхний слайд EN');
    expect(titles).not.toContain('Нуусан слайд EN');
    expect(response.body[0]).toMatchObject({
      mediaType: 'VIDEO',
      posterUrl: expect.stringMatching(/^\/uploads\//),
    });
  });

  it('хятад орчуулга байхгүй бол монголыг харуулна', async () => {
    const response = await context.guest
      .get('/public/slides?locale=zh')
      .expect(200);

    expect(
      response.body.map((slide: { title: string }) => slide.title),
    ).toContain('Эхний слайд');
  });

  it('засахад илгээгээгүй талбарууд өөрчлөгдөхгүй', async () => {
    const slide = await createSlide('Идэвхгүй болох', false);

    const response = await context.admin
      .patch(`/admin/slides/${slide.body.id}`)
      .send({ linkUrl: '/mn/news' })
      .expect(200);

    expect(response.body.isActive).toBe(false);
    expect(response.body.linkUrl).toBe('/mn/news');
  });

  it('дарааллыг сольж чадна', async () => {
    const first = await createSlide('A');
    const second = await createSlide('B');

    await context.admin
      .patch('/admin/slides/reorder')
      .send({ ids: [second.body.id, first.body.id] })
      .expect(204);

    const updated = await context.admin
      .get(`/admin/slides/${first.body.id}`)
      .expect(200);
    expect(updated.body.order).toBe(1);
  });

  it('байхгүй слайдад 404, буруу id-д 400 буцаана', async () => {
    await context.admin.get('/admin/slides/999999').expect(404);
    await context.admin.get('/admin/slides/abc').expect(400);
  });

  it('устгасан слайд олдохгүй', async () => {
    const slide = await createSlide('Устгах');

    await context.admin.delete(`/admin/slides/${slide.body.id}`).expect(204);
    await context.admin.get(`/admin/slides/${slide.body.id}`).expect(404);
  });
});
