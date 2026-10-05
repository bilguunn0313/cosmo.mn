import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import {
  assertTestDatabase,
  TEST_DATABASE_URL,
  TEST_UPLOADS_DIR,
} from './test-env';

export default function globalSetup() {
  assertTestDatabase(TEST_DATABASE_URL);

  execSync('npx prisma migrate deploy', {
    cwd: join(__dirname, '..'),
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: 'inherit',
  });

  rmSync(TEST_UPLOADS_DIR, { recursive: true, force: true });
}
