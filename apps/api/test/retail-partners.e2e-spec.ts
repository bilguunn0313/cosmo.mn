import { uploadTestImage } from './helpers/fixtures';
import { createTestApp, TestContext } from './helpers/test-app';

describe('Retail partners', () => {
  let context: TestContext;
  let logoId: number;

  beforeAll(async () => {
    context = await createTestApp();
    logoId = await uploadTestImage(context);
  });

  afterAll(async () => {
    await context.app.close();
  });

  function createPartner(name: string, extra: Record<string, unknown> = {}) {
    return context.admin
      .post('/admin/retail-partners')
      .send({ name, logoId, ...extra })
      .expect(201);
  }

  it('нийтэд дарааллаар нь, логоны хаягтай буцаана', async () => {
    await createPartner('Номин');
    await createPartner('Эмарт');

    const response = await context.guest
      .get('/public/retail-partners')
      .expect(200);

    expect(response.body).toEqual([
      { id: expect.any(Number), name: 'Номин', logoUrl: expect.any(String) },
      expect.objectContaining({ name: 'Эмарт' }),
    ]);
    expect(response.body[0].logoUrl).toMatch(/^\/uploads\//);
  });

  it('нуусан харилцагч нийтэд харагдахгүй', async () => {
    await createPartner('Нуусан', { isVisible: false });

    const response = await context.guest
      .get('/public/retail-partners')
      .expect(200);

    expect(
      response.body.map((partner: { name: string }) => partner.name),
    ).not.toContain('Нуусан');
  });

  it('логогүй эсвэл нэргүй бол хүлээж авахгүй', async () => {
    await context.admin
      .post('/admin/retail-partners')
      .send({ name: 'Логогүй' })
      .expect(400);
    await context.admin
      .post('/admin/retail-partners')
      .send({ name: ' ', logoId })
      .expect(400);
  });

  it('дарааллыг сольж болно', async () => {
    const first = await createPartner('Эхнийх');
    const second = await createPartner('Хоёрдох');
    const all = await context.admin.get('/admin/retail-partners').expect(200);
    const ids = all.body.map((partner: { id: number }) => partner.id);
    const reordered = [
      second.body.id,
      first.body.id,
      ...ids.filter(
        (id: number) => id !== first.body.id && id !== second.body.id,
      ),
    ];

    await context.admin
      .patch('/admin/retail-partners/reorder')
      .send({ ids: reordered })
      .expect(204);

    const response = await context.admin
      .get('/admin/retail-partners')
      .expect(200);
    expect(
      response.body.map((partner: { id: number }) => partner.id).slice(0, 2),
    ).toEqual([second.body.id, first.body.id]);
  });

  it('засварлаж, устгаж болно', async () => {
    const created = await createPartner('Засах');

    const updated = await context.admin
      .patch(`/admin/retail-partners/${created.body.id}`)
      .send({ name: 'Зассан' })
      .expect(200);
    expect(updated.body).toMatchObject({ name: 'Зассан', isVisible: true });

    await context.admin
      .delete(`/admin/retail-partners/${created.body.id}`)
      .expect(204);
    await context.admin
      .get(`/admin/retail-partners/${created.body.id}`)
      .expect(404);
  });

  it('ашиглагдаж буй логог зургийн сангаас устгахыг хориглоно', async () => {
    const usedLogoId = await uploadTestImage(context);
    await createPartner('Логотой', { logoId: usedLogoId });

    const deletion = await context.admin
      .delete(`/admin/media/${usedLogoId}`)
      .expect(409);
    expect(deletion.body.usages).toEqual([
      expect.objectContaining({ type: 'retailPartner', title: 'Логотой' }),
    ]);
  });

  it('нэвтрээгүй хүн админ хэсэгт хандаж чадахгүй', async () => {
    await context.guest.get('/admin/retail-partners').expect(401);
  });
});
