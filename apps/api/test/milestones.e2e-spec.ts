import { uploadTestImage } from './helpers/fixtures';
import { createTestApp, TestContext } from './helpers/test-app';

describe('Milestones', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestApp();
  });

  afterAll(async () => {
    await context.app.close();
  });

  function createMilestone(
    year: number,
    title: string,
    extra: Record<string, unknown> = {},
  ) {
    return context.admin
      .post('/admin/milestones')
      .send({
        year,
        translations: [
          { locale: 'mn', title, description: 'Тайлбар' },
          { locale: 'en', title: `${title} EN`, description: null },
        ],
        ...extra,
      })
      .expect(201);
  }

  it('нийтэд оноор нь эрэмбэлж, сонгосон хэлээр буцаана', async () => {
    await createMilestone(2015, 'Шинэ агуулах');
    await createMilestone(1996, 'Байгуулагдсан');

    const response = await context.guest
      .get('/public/milestones?locale=en')
      .expect(200);

    expect(response.body).toEqual([
      {
        id: expect.any(Number),
        year: 1996,
        title: 'Байгуулагдсан EN',
        description: null,
        imageUrl: null,
      },
      expect.objectContaining({ year: 2015, title: 'Шинэ агуулах EN' }),
    ]);
  });

  it('нуусан үйл явдал нийтэд харагдахгүй', async () => {
    await createMilestone(2001, 'Нуусан', { isVisible: false });

    const response = await context.guest.get('/public/milestones').expect(200);

    expect(response.body.map((m: { title: string }) => m.title)).not.toContain(
      'Нуусан',
    );
  });

  it('буруу оныг хүлээж авахгүй', async () => {
    await context.admin
      .post('/admin/milestones')
      .send({ year: 1800, translations: [{ locale: 'mn', title: 'Хуучин' }] })
      .expect(400);
  });

  it('монгол орчуулгагүй бол хүлээж авахгүй', async () => {
    await context.admin
      .post('/admin/milestones')
      .send({ year: 2020, translations: [{ locale: 'en', title: 'Only EN' }] })
      .expect(400);
  });

  it('засварлаж, устгаж болно', async () => {
    const created = await createMilestone(2010, 'Засах');

    const updated = await context.admin
      .patch(`/admin/milestones/${created.body.id}`)
      .send({ year: 2011 })
      .expect(200);
    expect(updated.body.year).toBe(2011);
    expect(updated.body.translations).toHaveLength(2);

    await context.admin
      .delete(`/admin/milestones/${created.body.id}`)
      .expect(204);
    await context.admin.get(`/admin/milestones/${created.body.id}`).expect(404);
  });

  it('зургийг хаягаар нь өгч, зургийн сангаас устгахыг хориглоно', async () => {
    const imageId = await uploadTestImage(context);
    await createMilestone(2020, 'Зурагтай', { imageId });

    const response = await context.guest.get('/public/milestones').expect(200);
    expect(
      response.body.find((m: { year: number }) => m.year === 2020).imageUrl,
    ).toMatch(/^\/uploads\//);

    const deletion = await context.admin
      .delete(`/admin/media/${imageId}`)
      .expect(409);
    expect(deletion.body.usages).toEqual([
      expect.objectContaining({ type: 'milestone', title: '2020 Зурагтай' }),
    ]);
  });

  it('нэвтрээгүй хүн админ хэсэгт хандаж чадахгүй', async () => {
    await context.guest.get('/admin/milestones').expect(401);
  });
});
