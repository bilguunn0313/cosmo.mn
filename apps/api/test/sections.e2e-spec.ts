import { createTestApp, TestContext } from './helpers/test-app';

describe('Sections', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestApp();
  });

  afterAll(async () => {
    await context.app.close();
  });

  function createSection(page: string, title: string, isVisible = true) {
    return context.admin
      .post('/admin/sections')
      .send({
        page,
        linkUrl: '/mn/about',
        isVisible,
        translations: [
          { locale: 'mn', title, body: '<p>Товч</p>' },
          { locale: 'en', title: `${title} EN`, body: '<p>Short</p>' },
        ],
      })
      .expect(201);
  }

  it('нүүр хуудасны хэсгийг "Цааш үзэх" холбоостой нь буцаана', async () => {
    await createSection('home', 'Бидний тухай');

    const response = await context.guest
      .get('/public/sections?page=home&locale=en')
      .expect(200);

    expect(response.body).toEqual([
      expect.objectContaining({
        title: 'Бидний тухай EN',
        body: '<p>Short</p>',
        linkUrl: '/mn/about',
      }),
    ]);
  });

  it('хуудас бүрийн хэсгүүдийг тусад нь харуулна', async () => {
    await createSection('human-resources', 'Байгууллагын соёл');

    const home = await context.guest
      .get('/public/sections?page=home')
      .expect(200);
    const hr = await context.guest
      .get('/public/sections?page=human-resources')
      .expect(200);

    expect(home.body.map((s: { title: string }) => s.title)).not.toContain(
      'Байгууллагын соёл',
    );
    expect(hr.body.map((s: { title: string }) => s.title)).toContain(
      'Байгууллагын соёл',
    );
  });

  it('нуусан хэсэг нийтэд харагдахгүй', async () => {
    await createSection('about', 'Нуусан', false);

    const response = await context.guest
      .get('/public/sections?page=about')
      .expect(200);

    expect(response.body.map((s: { title: string }) => s.title)).not.toContain(
      'Нуусан',
    );
  });

  it('байхгүй хуудсыг хүлээж авахгүй', async () => {
    await context.guest.get('/public/sections?page=unknown').expect(400);
  });

  it('засахад хэсгийн хуудсыг сольж болохгүй', async () => {
    const section = await createSection('home', 'Хуудас солих');

    const response = await context.admin
      .patch(`/admin/sections/${section.body.id}`)
      .send({ page: 'about' })
      .expect(200);

    expect(response.body.page).toBe('home');
  });

  it('админ хуудас бүрээр жагсаана', async () => {
    const response = await context.admin
      .get('/admin/sections?page=human-resources')
      .expect(200);

    expect(
      response.body.every(
        (section: { page: string }) => section.page === 'human-resources',
      ),
    ).toBe(true);
  });
});
