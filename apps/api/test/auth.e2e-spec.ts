import { createTestApp, TEST_ADMIN, TestContext } from './helpers/test-app';

describe('Auth', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestApp();
  });

  afterAll(async () => {
    await context.app.close();
  });

  it('нэвтрээгүй хэрэглэгч admin endpoint руу хандаж чадахгүй', async () => {
    await context.guest.get('/admin/slides').expect(401);
  });

  it('буруу нууц үгээр нэвтэрч чадахгүй', async () => {
    await context.guest
      .post('/auth/login')
      .send({ email: TEST_ADMIN.email, password: 'wrong-password' })
      .expect(401);
  });

  it('нэвтрэхэд httpOnly cookie тавина', async () => {
    const response = await context.guest
      .post('/auth/login')
      .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.password })
      .expect(200);

    const cookie = String(response.headers['set-cookie']);
    expect(cookie).toContain('access_token=');
    expect(cookie).toContain('HttpOnly');
  });

  it('нэвтэрсэн админы мэдээллийг буцаана', async () => {
    const response = await context.admin.get('/auth/me').expect(200);

    expect(response.body.email).toBe(TEST_ADMIN.email);
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('гарсны дараа admin endpoint руу хандаж чадахгүй', async () => {
    const agent = context.guest;
    await agent
      .post('/auth/login')
      .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.password })
      .expect(200);

    await agent.post('/auth/logout').expect(204);
    await agent.get('/auth/me').expect(401);
  });

  it('нууц үг солиход шинэ нууц үгээр нэвтэрнэ', async () => {
    await context.admin
      .patch('/auth/password')
      .send({ currentPassword: 'wrong', newPassword: 'NewPassword123!' })
      .expect(400);

    await context.admin
      .patch('/auth/password')
      .send({
        currentPassword: TEST_ADMIN.password,
        newPassword: 'NewPassword123!',
      })
      .expect(204);

    await context.guest
      .post('/auth/login')
      .send({ email: TEST_ADMIN.email, password: 'NewPassword123!' })
      .expect(200);
  });

  it('нэвтрэх оролдлогыг минутад 5 удаагаар хязгаарлана', async () => {
    let lastStatus = 0;

    for (let attempt = 0; attempt < 6; attempt++) {
      const response = await context.guest
        .post('/auth/login')
        .send({ email: TEST_ADMIN.email, password: 'wrong-password' });
      lastStatus = response.status;
    }

    expect(lastStatus).toBe(429);
  });
});
