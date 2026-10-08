import { createTestVideo } from './helpers/fixtures';
import { createTestApp, TestContext } from './helpers/test-app';

describe('News', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestApp();
  });

  afterAll(async () => {
    await context.app.close();
  });

  function createNews(slug: string, overrides: Record<string, unknown> = {}) {
    return context.admin
      .post('/admin/news')
      .send({
        slug,
        translations: [
          { locale: 'mn', title: 'Мэдээ', content: '<p>Агуулга</p>' },
          { locale: 'en', title: 'News', content: '<p>Content</p>' },
        ],
        ...overrides,
      })
      .expect(201);
  }

  it('нийтлэхэд нийтлэгдсэн огноог автоматаар тавина', async () => {
    const response = await createNews('published-news', { isPublished: true });

    expect(response.body.publishedAt).not.toBeNull();
  });

  it('ноорог нийтэд харагдахгүй', async () => {
    const response = await createNews('draft-news');

    expect(response.body.publishedAt).toBeNull();
    await context.guest.get('/public/news/draft-news').expect(404);
  });

  it('агуулгаас хортой attribute-уудыг цэвэрлэнэ', async () => {
    const response = await createNews('unsafe-news', {
      translations: [
        {
          locale: 'mn',
          title: 'x',
          content:
            '<p>Агуулга</p><img src="/uploads/a.webp" onerror="alert(1)">',
        },
      ],
    });

    expect(response.body.translations[0].content).not.toContain('onerror');
    expect(response.body.translations[0].content).toContain(
      '<img src="/uploads/a.webp" />',
    );
  });

  it('нооргийг дараа нь нийтлэхэд огноо тавигдаж, нийтэд харагдана', async () => {
    const draft = await createNews('later-news');

    const response = await context.admin
      .patch(`/admin/news/${draft.body.id}`)
      .send({ isPublished: true })
      .expect(200);

    expect(response.body.publishedAt).not.toBeNull();

    const detail = await context.guest
      .get('/public/news/later-news')
      .expect(200);
    expect(detail.body).toMatchObject({ title: 'Мэдээ', videoUrl: null });
  });

  it('зургийн сангийн видеог нийтэд хаягаар нь өгч, устгахыг хориглоно', async () => {
    const videoId = await createTestVideo(context);

    await createNews('video-news', { isPublished: true, videoId });

    const detail = await context.guest
      .get('/public/news/video-news')
      .expect(200);
    expect(detail.body.videoUrl).toMatch(/^\/uploads\/.+\.mp4$/);

    await context.admin.delete(`/admin/media/${videoId}`).expect(409);
  });

  it('хуудаслаж жагсаана', async () => {
    const response = await context.guest
      .get('/public/news?limit=1')
      .expect(200);

    expect(response.body.items).toHaveLength(1);
    expect(response.body.total).toBeGreaterThan(1);
  });

  it('ирээдүйн огноотой мэдээ тэр өдөр хүртэл харагдахгүй', async () => {
    await createNews('future-news', {
      isPublished: true,
      publishedAt: '2099-01-01T00:00:00.000Z',
    });

    await context.guest.get('/public/news/future-news').expect(404);
  });

  it('дэлгэрэнгүйг сонгосон хэлээр буцаана', async () => {
    const english = await context.guest
      .get('/public/news/published-news?locale=en')
      .expect(200);
    const chinese = await context.guest
      .get('/public/news/published-news?locale=zh')
      .expect(200);

    expect(english.body.title).toBe('News');
    expect(chinese.body.title).toBe('Мэдээ');
  });

  it('админ ноорог болон нийтлэгдсэн бүх мэдээг харна', async () => {
    const response = await context.admin.get('/admin/news').expect(200);

    const slugs = response.body.items.map(
      (item: { slug: string }) => item.slug,
    );
    expect(slugs).toEqual(
      expect.arrayContaining(['draft-news', 'published-news']),
    );
  });
});
