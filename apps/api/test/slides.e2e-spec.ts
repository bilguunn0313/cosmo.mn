import { createTestVideo, uploadTestImage } from './helpers/fixtures';
import { createTestApp, TestContext } from './helpers/test-app';

describe('Slides', () => {
  let context: TestContext;
  let videoId: number;
  let posterId: number;

  beforeAll(async () => {
    context = await createTestApp();
    videoId = await createTestVideo(context);
    posterId = await uploadTestImage(context);
  });

  afterAll(async () => {
    await context.app.close();
  });

  function createSlide(isActive = true) {
    return context.admin
      .post('/admin/slides')
      .send({ mediaId: videoId, posterId, isActive })
      .expect(201);
  }

  it('видео слайдыг poster зурагтай нь үүсгэнэ', async () => {
    const response = await createSlide();

    expect(response.body.media.type).toBe('VIDEO');
    expect(response.body.poster.id).toBe(posterId);
  });

  it('шинэ слайдыг хамгийн сүүлд байрлуулна', async () => {
    const first = await createSlide();
    const second = await createSlide();

    expect(second.body.order).toBe(first.body.order + 1);
  });

  it('видео эсвэл зураггүй слайдыг хүлээж авахгүй', async () => {
    await context.admin.post('/admin/slides').send({}).expect(400);
  });

  it('нийтийн API зөвхөн идэвхтэй слайдуудыг буцаана', async () => {
    const visible = await createSlide();
    const hidden = await createSlide(false);

    const response = await context.guest.get('/public/slides').expect(200);

    const ids = response.body.map((slide: { id: number }) => slide.id);
    expect(ids).toContain(visible.body.id);
    expect(ids).not.toContain(hidden.body.id);
    expect(response.body[0]).toMatchObject({
      mediaType: 'VIDEO',
      posterUrl: expect.stringMatching(/^\/uploads\//),
    });
  });

  it('засахад илгээгээгүй талбарууд өөрчлөгдөхгүй', async () => {
    const slide = await createSlide(false);

    const response = await context.admin
      .patch(`/admin/slides/${slide.body.id}`)
      .send({ posterId: null })
      .expect(200);

    expect(response.body.isActive).toBe(false);
    expect(response.body.poster).toBeNull();
  });

  it('дарааллыг сольж чадна', async () => {
    const first = await createSlide();
    const second = await createSlide();

    await context.admin
      .patch('/admin/slides/reorder')
      .send({ ids: [second.body.id, first.body.id] })
      .expect(204);

    const updated = await context.admin
      .get(`/admin/slides/${first.body.id}`)
      .expect(200);
    expect(updated.body.order).toBe(1);
  });

  it('байхгүй слайдад 404, буруу id-д 400 буцаана', async () => {
    await context.admin.get('/admin/slides/999999').expect(404);
    await context.admin.get('/admin/slides/abc').expect(400);
  });

  it('устгасан слайд олдохгүй', async () => {
    const slide = await createSlide();

    await context.admin.delete(`/admin/slides/${slide.body.id}`).expect(204);
    await context.admin.get(`/admin/slides/${slide.body.id}`).expect(404);
  });
});
