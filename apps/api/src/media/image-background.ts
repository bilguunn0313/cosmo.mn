import { join } from 'node:path';
import sharp from 'sharp';
import { UPLOADS_DIR, UPLOADS_URL_PREFIX } from './storage.service';

const SAMPLE_SIZE = 32;
const PLAIN_SHARE = 0.85;
const LIGHT_LEVEL = 232;
const TRANSPARENT_LEVEL = 32;

const cache = new Map<string, boolean>();

function isPlainPixel(pixels: Buffer, index: number) {
  const [red, green, blue, alpha] = pixels.subarray(index, index + 4);

  return (
    alpha < TRANSPARENT_LEVEL ||
    (red >= LIGHT_LEVEL && green >= LIGHT_LEVEL && blue >= LIGHT_LEVEL)
  );
}

function borderIndexes() {
  const last = SAMPLE_SIZE - 1;
  const indexes: number[] = [];

  for (let y = 0; y < SAMPLE_SIZE; y += 1) {
    for (let x = 0; x < SAMPLE_SIZE; x += 1) {
      if (x === 0 || y === 0 || x === last || y === last) {
        indexes.push((y * SAMPLE_SIZE + x) * 4);
      }
    }
  }

  return indexes;
}

const BORDER_INDEXES = borderIndexes();

export async function isCutoutImage(url: string) {
  const cached = cache.get(url);

  if (cached !== undefined) {
    return cached;
  }

  if (!url.startsWith(`${UPLOADS_URL_PREFIX}/`)) {
    return true;
  }

  try {
    const filePath = join(
      UPLOADS_DIR,
      url.slice(UPLOADS_URL_PREFIX.length + 1),
    );
    const pixels = await sharp(filePath)
      .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer();
    const plainCount = BORDER_INDEXES.filter((index) =>
      isPlainPixel(pixels, index),
    ).length;
    const isCutout = plainCount / BORDER_INDEXES.length >= PLAIN_SHARE;

    cache.set(url, isCutout);
    return isCutout;
  } catch {
    return true;
  }
}
