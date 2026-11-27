import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { createTestImage } from './helpers/fixtures';
import { createTestApp, TestContext } from './helpers/test-app';
import { TEST_UPLOADS_DIR } from './test-env';

interface UploadedImage {
  id: number;
  url: string;
}

describe('Ашиглагдахгүй болсон файлыг автоматаар устгах', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestApp();
  });

  afterAll(async () => {
    await context.app.close();
  });

  async function uploadImage(): Promise<UploadedImage> {
    const upload = await context.admin
      .post('/admin/media')
      .attach('file', await createTestImage(), {
        filename: 'image.png',
        contentType: 'image/png',
      })
      .expect(201);

    return upload.body as UploadedImage;
  }

  async function mediaExists(image: UploadedImage) {
    const response = await context.admin.get(
      `/admin/media/${image.id}/usages`,
    );
    return response.status === 200;
  }

  function fileExists(image: UploadedImage) {
    return existsSync(
      join(TEST_UPLOADS_DIR, image.url.replace('/uploads/', '')),
    );
  }

  async function createBrand(slug: string, logoId: number) {
    const response = await context.admin
      .post('/admin/brands')
      .send({
        slug,
        categories: ['FOOD'],
        logoId,
        translations: [{ locale: 'mn', name: slug }],
      })
      .expect(201);

    return response.body.id as number;
  }

  it('брэндийн логог солиход хуучин файл устна', async () => {
    const oldLogo = await uploadImage();
    const newLogo = await uploadImage();
    const brandId = await createBrand('replace-logo', oldLogo.id);

    await context.admin
      .patch(`/admin/brands/${brandId}`)
      .send({ logoId: newLogo.id })
      .expect(200);

    expect(await mediaExists(oldLogo)).toBe(false);
    expect(fileExists(oldLogo)).toBe(false);
    expect(await mediaExists(newLogo)).toBe(true);
    expect(fileExists(newLogo)).toBe(true);
  });

  it('хуучин файл өөр газар ашиглагдаж байвал хадгална', async () => {
    const sharedLogo = await uploadImage();
    const newLogo = await uploadImage();
    const firstBrandId = await createBrand('shared-logo-a', sharedLogo.id);
    await createBrand('shared-logo-b', sharedLogo.id);

    await context.admin
      .patch(`/admin/brands/${firstBrandId}`)
      .send({ logoId: newLogo.id })
      .expect(200);

    expect(await mediaExists(sharedLogo)).toBe(true);
  });

  it('брэндийн нэмэлт зургаас хассан зураг устна', async () => {
    const logo = await uploadImage();
    const kept = await uploadImage();
    const removed = await uploadImage();
    const brandId = await createBrand('cleanup-gallery', logo.id);

    await context.admin
      .patch(`/admin/brands/${brandId}`)
      .send({ imageIds: [kept.id, removed.id] })
      .expect(200);
    await context.admin
      .patch(`/admin/brands/${brandId}`)
      .send({ imageIds: [kept.id] })
      .expect(200);

    expect(await mediaExists(removed)).toBe(false);
    expect(fileExists(removed)).toBe(false);
    expect(await mediaExists(kept)).toBe(true);
    expect(fileExists(kept)).toBe(true);
  });

  it('зураггүй засвар нь зургийг хөндөхгүй', async () => {
    const logo = await uploadImage();
    const brandId = await createBrand('unchanged-logo', logo.id);

    await context.admin
      .patch(`/admin/brands/${brandId}`)
      .send({ isPublished: true })
      .expect(200);

    expect(await mediaExists(logo)).toBe(true);
  });

  it('мэдээний текстээс хассан зураг устна', async () => {
    const image = await uploadImage();
    const news = await context.admin
      .post('/admin/news')
      .send({
        slug: 'inline-image-news',
        translations: [
          {
            locale: 'mn',
            title: 'Мэдээ',
            content: `<p>Текст</p><img src="${image.url}">`,
          },
        ],
      })
      .expect(201);

    await context.admin
      .patch(`/admin/news/${news.body.id}`)
      .send({
        translations: [
          { locale: 'mn', title: 'Мэдээ', content: '<p>Текст</p>' },
        ],
      })
      .expect(200);

    expect(await mediaExists(image)).toBe(false);
  });

  it('брэнд устгахад лого, бүтээгдэхүүний зураг хамт устна', async () => {
    const logo = await uploadImage();
    const productImage = await uploadImage();
    const brandId = await createBrand('deleted-brand', logo.id);
    await context.admin
      .post(`/admin/brands/${brandId}/products`)
      .send({
        imageId: productImage.id,
        translations: [{ locale: 'mn', name: 'Бүтээгдэхүүн' }],
      })
      .expect(201);

    await context.admin.delete(`/admin/brands/${brandId}`).expect(204);

    expect(await mediaExists(logo)).toBe(false);
    expect(await mediaExists(productImage)).toBe(false);
  });

  it('зургийн санд шууд оруулсан, хаана ч сонгоогүй зургийг хөндөхгүй', async () => {
    const libraryImage = await uploadImage();
    const brandId = await createBrand('library-untouched', (await uploadImage()).id);

    await context.admin.delete(`/admin/brands/${brandId}`).expect(204);

    expect(await mediaExists(libraryImage)).toBe(true);
  });
});
