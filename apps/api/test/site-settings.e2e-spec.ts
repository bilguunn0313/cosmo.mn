import { uploadTestImage } from './helpers/fixtures';
import { createTestApp, TestContext } from './helpers/test-app';

describe('Site settings', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestApp();
  });

  afterAll(async () => {
    await context.app.close();
  });

  it('тохиргоо хоосон үед ч нийтийн API ажиллана', async () => {
    const response = await context.guest
      .get('/public/site-settings')
      .expect(200);

    expect(response.body.email).toBeNull();
  });

  it('админ хадгалсан мэдээллийг сонгосон хэлээр харуулна', async () => {
    await context.admin
      .put('/admin/site-settings')
      .send({
        phone: '+976 7700 0000',
        email: 'info@cosmo.mn',
        facebookUrl: 'https://facebook.com/cosmo',
        translations: [
          { locale: 'mn', address: 'Улаанбаатар', workingHours: '09:00–18:00' },
          { locale: 'en', address: 'Ulaanbaatar' },
        ],
      })
      .expect(200);

    const english = await context.guest
      .get('/public/site-settings?locale=en')
      .expect(200);
    const chinese = await context.guest
      .get('/public/site-settings?locale=zh')
      .expect(200);

    expect(english.body).toMatchObject({
      phone: '+976 7700 0000',
      email: 'info@cosmo.mn',
      address: 'Ulaanbaatar',
    });
    expect(chinese.body.address).toBe('Улаанбаатар');
  });

  it('зөвхөн илгээсэн талбарыг шинэчилнэ', async () => {
    await context.admin
      .put('/admin/site-settings')
      .send({ phone: '+976 8800 0000' })
      .expect(200);

    const response = await context.guest
      .get('/public/site-settings')
      .expect(200);
    expect(response.body).toMatchObject({
      phone: '+976 8800 0000',
      email: 'info@cosmo.mn',
      address: 'Улаанбаатар',
    });
  });

  it('байршлын зургийг хаягаар нь өгч, зургийн сангаас устгахыг хориглоно', async () => {
    const mapImageId = await uploadTestImage(context);

    await context.admin
      .put('/admin/site-settings')
      .send({ mapImageId, mapUrl: 'https://maps.app.goo.gl/abc' })
      .expect(200);

    const response = await context.guest
      .get('/public/site-settings')
      .expect(200);
    expect(response.body).toMatchObject({
      mapUrl: 'https://maps.app.goo.gl/abc',
      mapImageUrl: expect.stringMatching(/^\/uploads\//),
    });

    const deletion = await context.admin
      .delete(`/admin/media/${mapImageId}`)
      .expect(409);
    expect(deletion.body.usages).toEqual([
      expect.objectContaining({ type: 'siteSetting' }),
    ]);
  });

  it('ангиллын зургийг нийтэд өгч, зургийн сангаас устгахыг хориглоно', async () => {
    const foodImageId = await uploadTestImage(context);

    await context.admin
      .put('/admin/site-settings')
      .send({ foodImageId })
      .expect(200);

    const response = await context.guest
      .get('/public/site-settings')
      .expect(200);
    expect(response.body.categoryImages).toEqual({
      FOOD: expect.stringMatching(/^\/uploads\//),
      BEAUTY: null,
      HOUSEHOLD: null,
    });

    const deletion = await context.admin
      .delete(`/admin/media/${foodImageId}`)
      .expect(409);
    expect(deletion.body.usages).toEqual([
      expect.objectContaining({ type: 'siteSetting', title: 'Ангиллын зураг' }),
    ]);
  });

  it('тоон үзүүлэлтүүдийг хадгалж нийтэд өгнө', async () => {
    await context.admin
      .put('/admin/site-settings')
      .send({ foundedYear: 2008, employeeCount: 350, partnerCount: 2500 })
      .expect(200);

    const response = await context.guest
      .get('/public/site-settings')
      .expect(200);
    expect(response.body).toMatchObject({
      foundedYear: 2008,
      employeeCount: 350,
      partnerCount: 2500,
    });
  });

  it('сөрөг тоо болон бутархай оныг хүлээж авахгүй', async () => {
    await context.admin
      .put('/admin/site-settings')
      .send({ employeeCount: -5 })
      .expect(400);
    await context.admin
      .put('/admin/site-settings')
      .send({ foundedYear: 2008.5 })
      .expect(400);
  });

  it('буруу имэйлийг хүлээж авахгүй', async () => {
    await context.admin
      .put('/admin/site-settings')
      .send({ email: 'not-an-email' })
      .expect(400);
  });
});
