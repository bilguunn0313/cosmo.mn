import { framedImageUrl } from './framed-image-url';

const media = {
  url: '/uploads/images/photo.webp',
  focusX: 50,
  focusY: 50,
  zoom: 1,
};

describe('framedImageUrl', () => {
  it('зураг байхгүй бол null буцаана', () => {
    expect(framedImageUrl(null)).toBeNull();
  });

  it('голдоо, томруулаагүй зурагт энгийн url буцаана', () => {
    expect(framedImageUrl(media)).toBe('/uploads/images/photo.webp');
  });

  it('гол цэг, томруулалтыг url-д нэмнэ', () => {
    expect(
      framedImageUrl({ ...media, focusX: 25, focusY: 35, zoom: 1.4 }),
    ).toBe('/uploads/images/photo.webp?frame=25,35,1.4');
  });
});
