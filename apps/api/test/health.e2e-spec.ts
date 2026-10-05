import { createTestApp, TestContext } from './helpers/test-app';

describe('Health', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestApp();
  });

  afterAll(async () => {
    await context.app.close();
  });

  it('API болон өгөгдлийн сан ажиллаж байгааг харуулна', async () => {
    const response = await context.guest.get('/health').expect(200);

    expect(response.body).toEqual({ status: 'ok', database: 'up' });
  });
});
