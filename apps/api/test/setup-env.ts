import {
  assertTestDatabase,
  TEST_DATABASE_URL,
  TEST_UPLOADS_DIR,
} from './test-env';

assertTestDatabase(TEST_DATABASE_URL);

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = TEST_DATABASE_URL;
process.env.JWT_SECRET = 'e2e-test-secret';
process.env.UPLOADS_DIR = TEST_UPLOADS_DIR;
process.env.RESEND_API_KEY = '';
