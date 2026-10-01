import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client';

const PASSWORD_SALT_ROUNDS = 12;

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Admin';

  if (!email || !password) {
    throw new Error('.env файлд ADMIN_EMAIL болон ADMIN_PASSWORD-ийг бичнэ үү');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  try {
    const existing = await prisma.admin.findUnique({ where: { email } });

    if (existing) {
      console.log(`Админ аль хэдийн байна: ${email}`);
    } else {
      await prisma.admin.create({
        data: {
          email,
          name,
          passwordHash: await bcrypt.hash(password, PASSWORD_SALT_ROUNDS),
        },
      });
      console.log(`Админ үүслээ: ${email}`);
    }

    await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
