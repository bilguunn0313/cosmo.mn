import { createTestApp, TestContext } from './helpers/test-app';

describe('Admins', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestApp();
  });

  afterAll(async () => {
    await context.app.close();
  });

  it('шинэ админ нэмэхэд нууц үгийг буцаахгүй', async () => {
    const response = await context.admin
      .post('/admin/admins')
      .send({
        email: 'Second@Cosmo.mn',
        name: 'Хоёр',
        password: 'Password123!',
      })
      .expect(201);

    expect(response.body.email).toBe('second@cosmo.mn');
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('шинэ админ нэвтэрч чадна', async () => {
    await context.guest
      .post('/auth/login')
      .send({ email: 'second@cosmo.mn', password: 'Password123!' })
      .expect(200);
  });

  it('богино нууц үгийг хүлээж авахгүй', async () => {
    await context.admin
      .post('/admin/admins')
      .send({ email: 'short@cosmo.mn', name: 'x', password: '123' })
      .expect(400);
  });

  it('өөрийгөө устгаж чадахгүй', async () => {
    const me = await context.admin.get('/auth/me').expect(200);

    await context.admin.delete(`/admin/admins/${me.body.id}`).expect(400);
  });

  it('устгасан админы нэвтрэлт шууд хүчингүй болно', async () => {
    const created = await context.admin
      .post('/admin/admins')
      .send({ email: 'temp@cosmo.mn', name: 'Түр', password: 'Password123!' })
      .expect(201);

    const tempAgent = context.guest;
    await tempAgent
      .post('/auth/login')
      .send({ email: 'temp@cosmo.mn', password: 'Password123!' })
      .expect(200);

    await context.admin.delete(`/admin/admins/${created.body.id}`).expect(204);
    await tempAgent.get('/auth/me').expect(401);
  });
});
