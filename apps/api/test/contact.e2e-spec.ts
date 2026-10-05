import { createTestApp, TestContext } from './helpers/test-app';

describe('Contact', () => {
  let context: TestContext;
  let salesId: number;

  beforeAll(async () => {
    context = await createTestApp();

    await context.admin
      .put('/admin/site-settings')
      .send({ email: 'info@cosmo.mn' })
      .expect(200);

    const sales = await context.admin
      .post('/admin/contact-departments')
      .send({
        email: 'sales@cosmo.mn',
        translations: [
          { locale: 'mn', name: 'Хамтран ажиллах' },
          { locale: 'en', name: 'Partnership' },
        ],
      })
      .expect(201);
    salesId = sales.body.id;
  });

  afterAll(async () => {
    await context.app.close();
  });

  beforeEach(() => {
    context.sentEmails.length = 0;
  });

  function sendContact(body: Record<string, unknown>, ip: string) {
    return context.guest
      .post('/public/contact')
      .set('X-Forwarded-For', ip)
      .send(body);
  }

  describe('Албад', () => {
    it('идэвхтэй албадыг сонгосон хэлээр жагсаана', async () => {
      const response = await context.guest
        .get('/public/contact/departments?locale=en')
        .expect(200);

      expect(response.body).toEqual([{ id: salesId, name: 'Partnership' }]);
    });

    it('албадын имэйл хаягийг нийтэд харуулахгүй', async () => {
      const response = await context.guest
        .get('/public/contact/departments')
        .expect(200);

      expect(JSON.stringify(response.body)).not.toContain('sales@cosmo.mn');
    });

    it('идэвхгүй алба жагсаалтад харагдахгүй', async () => {
      const hidden = await context.admin
        .post('/admin/contact-departments')
        .send({
          email: 'old@cosmo.mn',
          isActive: false,
          translations: [{ locale: 'mn', name: 'Хуучин алба' }],
        })
        .expect(201);

      const response = await context.guest
        .get('/public/contact/departments')
        .expect(200);

      expect(response.body.map((d: { id: number }) => d.id)).not.toContain(
        hidden.body.id,
      );
    });
  });

  describe('Мессеж илгээх', () => {
    it('сонгосон албаны имэйл рүү илгээж, хариуг зочин руу чиглүүлнэ', async () => {
      await sendContact(
        {
          departmentId: salesId,
          name: 'Бат',
          email: 'bat@mail.com',
          phone: '99112233',
          message: 'Хамтран ажиллах талаар',
          locale: 'en',
        },
        '10.0.0.1',
      ).expect(204);

      expect(context.sentEmails).toHaveLength(1);
      expect(context.sentEmails[0]).toMatchObject({
        to: 'sales@cosmo.mn',
        replyTo: 'bat@mail.com',
        subject: '[cosmo.mn вэбсайт] Хамтран ажиллах: Бат',
      });
    });

    it('алба сонгоогүй бол ерөнхий имэйл рүү илгээнэ', async () => {
      await sendContact(
        {
          name: 'Сараа',
          email: 'saraa@mail.com',
          message: 'Ерөнхий асуулт байна',
        },
        '10.0.0.2',
      ).expect(204);

      expect(context.sentEmails[0]).toMatchObject({
        to: 'info@cosmo.mn',
        subject: '[cosmo.mn вэбсайт] Ерөнхий: Сараа',
      });
    });

    it('алба байхгүй бол ерөнхий имэйл рүү илгээнэ', async () => {
      await sendContact(
        {
          departmentId: 999999,
          name: 'Дорж',
          email: 'dorj@mail.com',
          message: 'Устсан алба руу бичлээ',
        },
        '10.0.0.3',
      ).expect(204);

      expect(context.sentEmails[0].to).toBe('info@cosmo.mn');
    });

    it('буруу өгөгдлийг илгээхгүй', async () => {
      await sendContact(
        { name: 'B', email: 'x', message: 'hi' },
        '10.0.0.4',
      ).expect(400);

      expect(context.sentEmails).toHaveLength(0);
    });

    it('нэг IP-ээс минутад 3-аас олон мессеж илгээхийг хязгаарлана', async () => {
      const message = {
        name: 'Бат',
        email: 'bat@mail.com',
        message: 'Дахин бичлээ',
      };

      for (let attempt = 0; attempt < 3; attempt++) {
        await sendContact(message, '10.0.0.5').expect(204);
      }
      await sendContact(message, '10.0.0.5').expect(429);
      await sendContact(message, '10.0.0.6').expect(204);
    });
  });
});
