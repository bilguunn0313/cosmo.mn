import { PrismaService } from '../../src/prisma/prisma.service';

const RESET_TIMEOUT_MS = 30_000;

export async function resetDatabase(prisma: PrismaService) {
  const tables = await prisma.$queryRaw<{ name: string }[]>`
    SELECT table_name AS name FROM information_schema.tables
    WHERE table_schema = DATABASE() AND table_name <> '_prisma_migrations'
  `;

  await prisma.$transaction(
    async (tx) => {
      await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0');

      for (const table of tables) {
        await tx.$executeRawUnsafe(`DELETE FROM \`${table.name}\``);
      }

      await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1');
    },
    { timeout: RESET_TIMEOUT_MS },
  );
}
