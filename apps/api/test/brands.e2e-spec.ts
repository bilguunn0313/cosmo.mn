import { uploadTestImage } from './helpers/fixtures';
import { createTestApp, TestContext } from './helpers/test-app';

describe('Brands', () => {
  let context: TestContext;
  let logoId: number;

  beforeAll(async () => {
    context = await createTestApp();
    logoId = await uploadTestImage(context);
  });

  afterAll(async () => {
    await context.app.close();
  });

  function createBrand(slug: string, overrides: Record<string, unknown> = {}) {
    return context.admin.post('/admin/brands').send({
      slug,
      categories: ['BEAUTY', 'HOUSEHOLD'],
      logoId,
      isPublished: true,
      translations: [
        { locale: 'mn', name: 'Тест брэнд' },
        { locale: 'en', name: 'Test brand' },
      ],
      ...overrides,
    });
  }

  it('брэнд үүсгэнэ', async () => {
    const response = await createBrand('brand-a').expect(201);

    expect(response.body).toMatchObject({
      slug: 'brand-a',
      categories: ['BEAUTY', 'HOUSEHOLD'],
      isPublished: true,
    });
    expect(response.body.logo.id).toBe(logoId);
  });

  it('давхардсан slug-ийг хүлээж авахгүй', async () => {
    await createBrand('brand-dup').expect(201);
    await createBrand('brand-dup').expect(409);
  });

  it('буруу хэлбэртэй slug-ийг хүлээж авахгүй', async () => {
    await createBrand('Bad Slug').expect(400);
  });

  it('байхгүй зургийн id-г хүлээж авахгүй', async () => {
    await createBrand('brand-no-logo', { logoId: 999999 }).expect(400);
  });

  it('ангиллаар шүүж нийтэд харуулна', async () => {
    await createBrand('brand-food', { categories: ['FOOD'] }).expect(201);

    const beauty = await context.guest
      .get('/public/brands?category=BEAUTY')
      .expect(200);
    const food = await context.guest
      .get('/public/brands?category=FOOD')
      .expect(200);

    const beautySlugs = beauty.body.map(
      (brand: { slug: string }) => brand.slug,
    );
    const foodSlugs = food.body.map((brand: { slug: string }) => brand.slug);
    expect(beautySlugs).toContain('brand-a');
    expect(beautySlugs).not.toContain('brand-food');
    expect(foodSlugs).toEqual(['brand-food']);
  });

  it('дэлгэрэнгүйг сонгосон хэлээр, байхгүй бол монголоор буцаана', async () => {
    const english = await context.guest
      .get('/public/brands/brand-a?locale=en')
      .expect(200);
    const chinese = await context.guest
      .get('/public/brands/brand-a?locale=zh')
      .expect(200);

    expect(english.body.name).toBe('Test brand');
    expect(chinese.body.name).toBe('Тест брэнд');
    expect(english.body.logoUrl).toMatch(/^\/uploads\//);
  });

  it('засахад нийтлэгдсэн төлөв өөрчлөгдөхгүй', async () => {
    const brand = await createBrand('brand-edit').expect(201);

    const response = await context.admin
      .patch(`/admin/brands/${brand.body.id}`)
      .send({ websiteUrl: 'https://example.com' })
      .expect(200);

    expect(response.body.isPublished).toBe(true);
    expect(response.body.websiteUrl).toBe('https://example.com');
  });

  it('нийтлэгдээгүй брэнд нийтэд харагдахгүй', async () => {
    const brand = await createBrand('brand-hidden').expect(201);

    await context.admin
      .patch(`/admin/brands/${brand.body.id}`)
      .send({ isPublished: false })
      .expect(200);

    await context.guest.get('/public/brands/brand-hidden').expect(404);
  });

  describe('Брэндийн хэсгүүд', () => {
    let brandId: number;

    beforeAll(async () => {
      const brand = await createBrand('brand-sections').expect(201);
      brandId = brand.body.id;
    });

    function createSection(title: string, body: string, isVisible = true) {
      return context.admin
        .post(`/admin/brands/${brandId}/sections`)
        .send({
          imageId: logoId,
          isVisible,
          translations: [{ locale: 'mn', title, body }],
        })
        .expect(201);
    }

    it('хэсгийн HTML-ээс хортой кодыг цэвэрлэнэ', async () => {
      const response = await createSection(
        'Түүх',
        '<p>Сайн</p><script>alert(1)</script>',
      );

      expect(response.body.translations[0].body).toBe('<p>Сайн</p>');
    });

    it('брэндийн дэлгэрэнгүйд зөвхөн харагдах хэсгүүдийг дарааллаар нь буцаана', async () => {
      await createSection('Бүтээгдэхүүн', '<p>Жагсаалт</p>');
      await createSection('Нуусан', '<p>x</p>', false);

      const response = await context.guest
        .get('/public/brands/brand-sections')
        .expect(200);

      expect(
        response.body.sections.map(
          (section: { title: string }) => section.title,
        ),
      ).toEqual(['Түүх', 'Бүтээгдэхүүн']);
    });

    it('өөр брэндийн хэсгийг энэ брэндээр дамжуулж засахгүй', async () => {
      const other = await createBrand('brand-other').expect(201);
      const section = await createSection('Миний хэсэг', '<p>x</p>');

      await context.admin
        .patch(`/admin/brands/${other.body.id}/sections/${section.body.id}`)
        .send({ isVisible: false })
        .expect(404);
    });

    it('брэндийг устгахад хэсгүүд нь хамт устана', async () => {
      const brand = await createBrand('brand-cascade').expect(201);
      await context.admin
        .post(`/admin/brands/${brand.body.id}/sections`)
        .send({
          translations: [{ locale: 'mn', title: 'x', body: '<p>x</p>' }],
        })
        .expect(201);

      await context.admin.delete(`/admin/brands/${brand.body.id}`).expect(204);

      const remaining = await context.prisma.brandSection.count({
        where: { brandId: brand.body.id },
      });
      expect(remaining).toBe(0);
    });
  });

  describe('Брэндийн бүтээгдэхүүн', () => {
    let brandId: number;

    beforeAll(async () => {
      const brand = await createBrand('brand-products').expect(201);
      brandId = brand.body.id;
    });

    function createProduct(name: string, isVisible = true) {
      return context.admin
        .post(`/admin/brands/${brandId}/products`)
        .send({
          imageId: logoId,
          isVisible,
          translations: [
            { locale: 'mn', name, description: `${name} тайлбар` },
            { locale: 'en', name: `${name} EN` },
          ],
        })
        .expect(201);
    }

    it('бүтээгдэхүүнийг зурагтай нь нэмнэ', async () => {
      const response = await createProduct('Крем');

      expect(response.body.image.id).toBe(logoId);
      expect(response.body.translations).toHaveLength(2);
    });

    it('зураггүй бүтээгдэхүүнийг хүлээж авахгүй', async () => {
      await context.admin
        .post(`/admin/brands/${brandId}/products`)
        .send({ translations: [{ locale: 'mn', name: 'Зураггүй' }] })
        .expect(400);
    });

    it('брэндийн хуудсанд зөвхөн харагдах бүтээгдэхүүнийг дарааллаар нь сонгосон хэлээр харуулна', async () => {
      await createProduct('Шампунь');
      await createProduct('Нуусан бүтээгдэхүүн', false);

      const response = await context.guest
        .get('/public/brands/brand-products?locale=en')
        .expect(200);

      expect(
        response.body.products.map((product: { name: string }) => product.name),
      ).toEqual(['Крем EN', 'Шампунь EN']);
      expect(response.body.products[0]).toMatchObject({
        description: null,
        imageUrl: expect.stringMatching(/^\/uploads\//),
      });

      const mongolian = await context.guest
        .get('/public/brands/brand-products?locale=mn')
        .expect(200);
      expect(mongolian.body.products[0].description).toBe('Крем тайлбар');
    });

    it('дарааллыг сольж чадна', async () => {
      const list = await context.admin
        .get(`/admin/brands/${brandId}/products`)
        .expect(200);
      const ids = list.body.map((product: { id: number }) => product.id);

      await context.admin
        .patch(`/admin/brands/${brandId}/products/reorder`)
        .send({ ids: [...ids].reverse() })
        .expect(204);

      const reordered = await context.admin
        .get(`/admin/brands/${brandId}/products`)
        .expect(200);
      expect(
        reordered.body.map((product: { id: number }) => product.id),
      ).toEqual([...ids].reverse());
    });

    it('өөр брэндийн бүтээгдэхүүнийг энэ брэндээр дамжуулж засахгүй', async () => {
      const other = await createBrand('brand-products-other').expect(201);
      const product = await createProduct('Миний бүтээгдэхүүн');

      await context.admin
        .patch(`/admin/brands/${other.body.id}/products/${product.body.id}`)
        .send({ isVisible: false })
        .expect(404);
    });

    it('бүтээгдэхүүнд ашиглагдаж байгаа зургийг устгахгүй', async () => {
      const response = await context.admin
        .get(`/admin/media/${logoId}/usages`)
        .expect(200);

      expect(
        response.body.some(
          (usage: { type: string }) => usage.type === 'product',
        ),
      ).toBe(true);
    });

    it('брэндийг устгахад бүтээгдэхүүнүүд нь хамт устана', async () => {
      const brand = await createBrand('brand-products-cascade').expect(201);
      await context.admin
        .post(`/admin/brands/${brand.body.id}/products`)
        .send({
          imageId: logoId,
          translations: [{ locale: 'mn', name: 'x' }],
        })
        .expect(201);

      await context.admin.delete(`/admin/brands/${brand.body.id}`).expect(204);

      const remaining = await context.prisma.product.count({
        where: { brandId: brand.body.id },
      });
      expect(remaining).toBe(0);
    });
  });
});
