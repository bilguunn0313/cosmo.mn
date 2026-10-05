import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://cosmo:cosmo@localhost:5433/cosmo_test';

export const TEST_UPLOADS_DIR = join(tmpdir(), 'cosmo-test-uploads');

export function assertTestDatabase(url: string) {
  if (!new URL(url).pathname.endsWith('_test')) {
    throw new Error(
      `E2E тест зөвхөн "_test"-ээр төгссөн өгөгдлийн сан дээр ажиллана. Одоо: ${url}`,
    );
  }
}
