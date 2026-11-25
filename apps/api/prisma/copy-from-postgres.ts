import 'dotenv/config';
import * as mariadb from 'mariadb';
import { Client, types } from 'pg';
import { adapterConnectionString } from '../src/prisma/adapter-connection-string';

const TIMESTAMP_WITHOUT_TIME_ZONE = 1114;
const POSTGRES_URL =
  process.env.POSTGRES_URL ?? 'postgresql://cosmo:cosmo@localhost:5433/cosmo';
const ARRAY_TO_JSON_COLUMNS = new Set(['Brand.categories']);

types.setTypeParser(TIMESTAMP_WITHOUT_TIME_ZONE, (value) => value);

function parsePostgresArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' && value.length > 2) {
    return value.slice(1, -1).split(',');
  }

  return [];
}

function toMysqlValue(table: string, column: string, value: unknown) {
  if (ARRAY_TO_JSON_COLUMNS.has(`${table}.${column}`)) {
    return JSON.stringify(parsePostgresArray(value));
  }

  return value;
}

async function countRows(target: mariadb.Connection, table: string) {
  const [row] = await target.query<{ total: bigint }[]>(
    `SELECT COUNT(*) AS total FROM \`${table}\``,
  );
  return Number(row.total);
}

async function main() {
  const mysqlUrl = process.env.DATABASE_URL;

  if (!mysqlUrl?.startsWith('mysql://')) {
    throw new Error('.env файлын DATABASE_URL нь mysql:// хаяг байх ёстой');
  }

  const source = new Client({ connectionString: POSTGRES_URL });
  const target = await mariadb.createConnection(
    adapterConnectionString(mysqlUrl).replace(/^mysql:/, 'mariadb:'),
  );
  await source.connect();

  try {
    const { rows: tables } = await source.query<{ tablename: string }>(
      `SELECT tablename FROM pg_tables
       WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
       ORDER BY tablename`,
    );

    for (const { tablename } of tables) {
      if ((await countRows(target, tablename)) > 0) {
        throw new Error(
          `MySQL-ийн "${tablename}" хүснэгт хоосон биш байна. Юу ч хуулаагүй.`,
        );
      }
    }

    await target.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const { tablename } of tables) {
      const { rows } = await source.query<Record<string, unknown>>(
        `SELECT * FROM "${tablename}"`,
      );

      if (rows.length > 0) {
        const columns = Object.keys(rows[0]);
        const columnList = columns.map((column) => `\`${column}\``).join(', ');
        const placeholders = columns.map(() => '?').join(', ');
        const values = rows.map((row) =>
          columns.map((column) => toMysqlValue(tablename, column, row[column])),
        );

        await target.batch(
          `INSERT INTO \`${tablename}\` (${columnList}) VALUES (${placeholders})`,
          values,
        );
      }

      const copied = await countRows(target, tablename);
      const status = copied === rows.length ? 'OK' : 'ТААРАХГҮЙ';
      console.log(`${status}  ${tablename}: ${rows.length} → ${copied}`);
    }

    await target.query('SET FOREIGN_KEY_CHECKS = 1');
  } finally {
    await source.end();
    await target.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
