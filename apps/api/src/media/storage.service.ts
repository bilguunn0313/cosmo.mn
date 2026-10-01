import { Injectable } from '@nestjs/common';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export const UPLOADS_URL_PREFIX = '/uploads';

export const UPLOADS_DIR =
  process.env.UPLOADS_DIR ?? join(process.cwd(), 'uploads');

@Injectable()
export class StorageService {
  async save(relativePath: string, data: Buffer): Promise<string> {
    const filePath = join(UPLOADS_DIR, relativePath);

    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, data);

    return `${UPLOADS_URL_PREFIX}/${relativePath}`;
  }

  async remove(url: string): Promise<void> {
    if (!url.startsWith(`${UPLOADS_URL_PREFIX}/`)) {
      return;
    }

    const relativePath = url.slice(UPLOADS_URL_PREFIX.length + 1);
    await rm(join(UPLOADS_DIR, relativePath), { force: true });
  }
}
