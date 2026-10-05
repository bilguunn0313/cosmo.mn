import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app.setup';
import { MailService } from '../../src/mail/mail.service';
import type { MailMessage } from '../../src/mail/mail.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { resetDatabase } from './database';

export const TEST_ADMIN = {
  email: 'admin@test.mn',
  password: 'Password123!',
  name: 'Test Admin',
};

export interface TestContext {
  app: NestExpressApplication;
  prisma: PrismaService;
  sentEmails: MailMessage[];
  guest: ReturnType<typeof request.agent>;
  admin: ReturnType<typeof request.agent>;
}

export async function createTestApp(): Promise<TestContext> {
  const sentEmails: MailMessage[] = [];
  const fakeMailService = {
    send: (message: MailMessage) => {
      sentEmails.push(message);
      return Promise.resolve();
    },
  };

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(MailService)
    .useValue(fakeMailService)
    .compile();

  const app = moduleRef.createNestApplication<NestExpressApplication>();
  configureApp(app);
  await app.init();

  const prisma = app.get(PrismaService);
  await resetDatabase(prisma);
  await createAdmin(prisma);

  const guest = request.agent(app.getHttpServer());
  const admin = request.agent(app.getHttpServer());
  await admin
    .post('/auth/login')
    .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.password })
    .expect(200);

  return { app, prisma, sentEmails, guest, admin };
}

async function createAdmin(prisma: PrismaService) {
  const { hash } = await import('bcrypt');

  await prisma.admin.create({
    data: {
      email: TEST_ADMIN.email,
      name: TEST_ADMIN.name,
      passwordHash: await hash(TEST_ADMIN.password, 4),
    },
  });
}
