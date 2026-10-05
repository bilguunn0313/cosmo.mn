import sharp from 'sharp';
import type { TestContext } from './test-app';

export function createTestImage(width = 3000, height = 1500) {
  return sharp({
    create: { width, height, channels: 3, background: '#3366aa' },
  })
    .png()
    .toBuffer();
}

export async function uploadTestImage(context: TestContext): Promise<number> {
  const response = await context.admin
    .post('/admin/media')
    .attach('file', await createTestImage(), {
      filename: 'test.png',
      contentType: 'image/png',
    })
    .expect(201);

  return response.body.id;
}

export async function createTestVideo(context: TestContext): Promise<number> {
  const response = await context.admin
    .post('/admin/media')
    .attach('file', Buffer.from('fake video bytes'), {
      filename: 'test.mp4',
      contentType: 'video/mp4',
    })
    .expect(201);

  return response.body.id;
}
