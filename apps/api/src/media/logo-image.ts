import { access } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { UPLOADS_DIR, UPLOADS_URL_PREFIX } from './storage.service';

const TRIM_THRESHOLD = 18;
const LIGHT_LEVEL = 228;
const TRANSPARENT_LEVEL = 24;
const EDGE_SOFTNESS = 90;
const CLEAR_SUFFIX = '.clear.webp';

export interface LogoImage {
  url: string;
  width: number | null;
  height: number | null;
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const cache = new Map<string, Promise<LogoImage>>();

export function clearLogoUrl(url: string) {
  return url.replace(/\.webp$/, CLEAR_SUFFIX);
}

function uploadPath(url: string) {
  return join(UPLOADS_DIR, url.slice(UPLOADS_URL_PREFIX.length + 1));
}

async function fileExists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function contentBox(source: string): Promise<Box> {
  const { width = 0, height = 0 } = await sharp(source).metadata();

  try {
    const flattened = await sharp(source)
      .flatten({ background: '#ffffff' })
      .toBuffer();
    const { info } = await sharp(flattened)
      .trim({ background: '#ffffff', threshold: TRIM_THRESHOLD })
      .toBuffer({ resolveWithObject: true });

    return {
      left: -(info.trimOffsetLeft ?? 0),
      top: -(info.trimOffsetTop ?? 0),
      width: info.width,
      height: info.height,
    };
  } catch {
    return { left: 0, top: 0, width, height };
  }
}

function isBackground(pixels: Buffer, index: number) {
  const offset = index * 4;

  return (
    pixels[offset + 3] < TRANSPARENT_LEVEL ||
    (pixels[offset] >= LIGHT_LEVEL &&
      pixels[offset + 1] >= LIGHT_LEVEL &&
      pixels[offset + 2] >= LIGHT_LEVEL)
  );
}

function findOuterBackground(pixels: Buffer, width: number, height: number) {
  const total = width * height;
  const outer = new Uint8Array(total);
  const stack = new Int32Array(total);
  let size = 0;

  const visit = (index: number) => {
    if (outer[index] || !isBackground(pixels, index)) {
      return;
    }

    outer[index] = 1;
    stack[size] = index;
    size += 1;
  };

  for (let x = 0; x < width; x += 1) {
    visit(x);
    visit(total - width + x);
  }

  for (let y = 0; y < height; y += 1) {
    visit(y * width);
    visit(y * width + width - 1);
  }

  while (size > 0) {
    size -= 1;
    const index = stack[size];
    const x = index % width;

    if (x > 0) visit(index - 1);
    if (x < width - 1) visit(index + 1);
    if (index >= width) visit(index - width);
    if (index < total - width) visit(index + width);
  }

  return outer;
}

function touchesOuter(outer: Uint8Array, index: number, width: number) {
  const x = index % width;

  return (
    (x > 0 && outer[index - 1] === 1) ||
    (x < width - 1 && outer[index + 1] === 1) ||
    outer[index - width] === 1 ||
    outer[index + width] === 1
  );
}

function clearOuterBackground(pixels: Buffer, width: number, height: number) {
  const outer = findOuterBackground(pixels, width, height);

  for (let index = 0; index < width * height; index += 1) {
    const offset = index * 4;

    if (outer[index]) {
      pixels[offset + 3] = 0;
    } else if (touchesOuter(outer, index, width)) {
      const lightest = Math.min(
        pixels[offset],
        pixels[offset + 1],
        pixels[offset + 2],
      );
      const darkness = 255 - lightest;
      pixels[offset + 3] = Math.round(
        pixels[offset + 3] * Math.min(1, darkness / EDGE_SOFTNESS),
      );
    }
  }
}

async function writeClearCopy(source: string, target: string) {
  const box = await contentBox(source);
  const { data, info } = await sharp(source)
    .extract(box)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  clearOuterBackground(data, info.width, info.height);

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(target);
}

async function createClearLogo(logo: LogoImage): Promise<LogoImage> {
  const url = clearLogoUrl(logo.url);
  const target = uploadPath(url);

  try {
    if (!(await fileExists(target))) {
      await writeClearCopy(uploadPath(logo.url), target);
    }

    const { width, height } = await sharp(target).metadata();
    return { url, width: width ?? null, height: height ?? null };
  } catch {
    return logo;
  }
}

export function clearLogo(logo: LogoImage | null) {
  if (
    !logo ||
    !logo.url.startsWith(`${UPLOADS_URL_PREFIX}/`) ||
    !logo.url.endsWith('.webp')
  ) {
    return Promise.resolve(logo);
  }

  let pending = cache.get(logo.url);

  if (!pending) {
    pending = createClearLogo(logo);
    cache.set(logo.url, pending);
  }

  return pending;
}
